import lib.environment
import os
import logging
import datetime
import itertools

from botocore.exceptions import ClientError
from celery import Celery
from celery.schedules import crontab
from app.db import Job as JobDocument

from app import crypto
from app.jobiili import Client as JobiiliClient
from lib.config import INTERNSHIPPER_APP_URL, POLLING_INTERVAL
from mailers.sender import Sender as EmailSender


app = Celery('tasks', broker=os.environ['RABBITMQ_URI'])

app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Europe/Helsinki',
    enable_utc=True,
)


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # TODO: create a more clever solution for polling that fills the following criteria:
    # * Requires minimal communication with db
    # * Leaves no unneeded tasks running
    sender.add_periodic_task(
        POLLING_INTERVAL, perform_bulk_job_polling.s())


@app.task
def perform_bulk_job_polling():
    def perform_polling_task(job: JobDocument):
        if job.confirmed:
            perform_job_polling.s(job.to_dict()).apply_async()
        else:
            raise Exception(
                'Polling should only be initialized for confirmed jobs')
    [perform_polling_task(job)
        for job in JobDocument.objects(confirmed=True)]


@app.task
def perform_job_polling(job_dict: dict):
    job = JobDocument.objects.get(id=job_dict['id'])
    client = JobiiliClient(crypto.decrypt(
        job.user), crypto.decrypt(job.password))
    client.login()
    jobs = client.get_jobs(job.request)
    curr_jobs = __apply_custom_options(jobs, job.options)
    new_jobs = __extract_new_jobs(job.found_jobs, curr_jobs)
    if len(new_jobs) != 0:
        job.update(found_jobs=[*job.found_jobs, *jobs])
        email_sender = EmailSender("new_jobs.html")
        template_params = {
            "jobs": __add_custom_template_fields(new_jobs),
            "delete_link": __generate_delete_url(job)
        }
        email_sender.send_email(
            email_to=job.email,
            email_from="internshipper.io <no-reply@internshipper.io>",
            subject="New Internship Position",
            template_params=template_params
        )
    logging.info("{} Poll complete for job {}".format(
        datetime.datetime.utcnow(), job["id"]))


def __apply_custom_options(jobs, options):
    if options.get("exclude_advanced_students"):
        return list(filter(
            lambda job: not job["advancedStudentsOnly"], jobs))
    return jobs


def __extract_new_jobs(prev_list, curr_list):
    prev_ids = map(lambda job: job["id"], prev_list)
    curr_ids = map(lambda job: job["id"], curr_list)
    new_ids = [x for x in curr_ids if x not in prev_ids]
    return list(filter(lambda job: job["id"] in new_ids, curr_list))


def __generate_delete_url(job: JobDocument):
    return "%s/jobs/delete/%s" % (INTERNSHIPPER_APP_URL, job.id)


def __add_custom_template_fields(jobs: list):
    return list(map(lambda job: {**job, "jobWeeksContinuous": __get_max_continuous_availability(job)}, jobs))


def __get_max_continuous_availability(job: dict):
    availability = job["availability"]
    normalized_availability = map(
        lambda spots: 0 if spots == 0 else 1, availability)

    grouped_sequences = itertools.groupby(normalized_availability)
    sequence_lengths = [sum(value for _ in group)
                        for value, group in grouped_sequences]

    return max(sequence_lengths)


if __name__ == '__main__':
    app.start()
