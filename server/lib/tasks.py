import os
import logging
import datetime

from botocore.exceptions import ClientError
from celery import Celery

from app import crypto
from app.jobiili import Client as JobiiliClient
from app.util import ses_client, create_html_email_from_template, create_plaintext_email_from_template
from app.db import Job as JobDocument


app = Celery('tasks', broker=os.environ['RABBITMQ_URI'])
POLLING_INTERVAL = 10.0

app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Europe/Helsinki',
    enable_utc=True,
)


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    for job in JobDocument.objects(confirmed=True):
        sender.add_periodic_task(
            POLLING_INTERVAL, perform_job_polling.s(job.to_dict()), name='fetch_job')


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
        __inform_new_jobs(new_jobs, job)
        job.update(found_jobs=[*job.found_jobs, *jobs])
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


def __inform_new_jobs(jobs: list, job: dict):
    try:
        template = "new_jobs.html"
        response = ses_client.send_email(
            Destination={
                'ToAddresses': [job["email"]],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': create_html_email_from_template(template, jobs=jobs),
                    },
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': create_plaintext_email_from_template(template, jobs=jobs),
                    },
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': "New Internship Position",
                },
            },
            # TODO replace with No Reply <no-reply@internshipper.io>
            Source="Test Source <eelis.kostiainen@gmail.com>",
            # If you are not using a configuration set, comment or delete the following line
            # ConfigurationSetName="ConfigSet",
        )
        logging.info("Email sent (id: {})".format(response['MessageId']))
    except ClientError as e:
        logging.error(e.response)
        logging.error(e.response['Error']['Message'])


if __name__ == '__main__':
    app.start()