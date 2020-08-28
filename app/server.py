from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi_utils.tasks import repeat_every

from util import poll_jobs, ses_client, \
    create_html_email_from_template, \
    create_plaintext_email_from_template
from botocore.exceptions import ClientError
from exceptions import BadRequestException
from jobiili import Client as JobiiliClient
from models import CreateJob
from db import Job as JobDocument
from typing import Iterable

import mongoengine
import logging
import json
import os


app = FastAPI()
INTERNSHIPPER_APP_URL = os.environ.get(
    "INTERNSHIPPER_APP_URL", "https://internshipper.io")


@app.on_event("startup")
@repeat_every(seconds=10, wait_first=True)
def perform_job_polling():
    for job in JobDocument.objects(confirmed=True):
        poll_jobs(job)


@app.post("/jobs")
def register(job: CreateJob):
    client = JobiiliClient(job.user, job.password)
    client.login()
    document = JobDocument(email=job.email, request=job.request,
                           password=job.password, user=job.user, options=job.options)
    try:
        document.save()
        __try_send_confirmation_email(document)
        return {"success": True, "result": json.loads(document.to_json()), "identity": client.identity}
    except:
        raise BadRequestException("Jobiili request was likely malformed")


@app.get("/jobs/delete/{job_id}")
def delete_job(job_id: str):
    """
    Removes a job from the collection.
    No authentication with the assumption the user
    has received this link from their email address
    """
    # TODO add additional protection eg. Nonce and link validity period
    document = JobDocument.objects.get(id=job_id)
    document.delete()

    return {"success": True}


@app.get("/jobs/confirm/{job_id}")
def confirm_job(job_id: str):
    # TODO add nonce and/or other forms of validation
    document = JobDocument.objects.get(id=job_id)
    if not document.confirmed:
        document.update(confirmed=True)
        # tasks.schedule_job(document)
        return RedirectResponse("/")
    else:
        raise BadRequestException("Subscription already confirmed")


def __try_send_confirmation_email(job: JobDocument):
    try:
        template = "confirm.html"
        confirmation_link = __generate_confirmation_url(job)
        response = ses_client.send_email(
            Destination={
                'ToAddresses': [job.email],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': create_html_email_from_template(template, confirmation_url=confirmation_link)
                    },
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': create_plaintext_email_from_template(template, confirmation_url=confirmation_link),
                    },
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': 'Confirm your subscription to internshipper.io',
                },
            },
            Source="Test Source <eelis.kostiainen@gmail.com>",
        )
        logging.info("Email sent (id: {})".format(response['MessageId']))
    except ClientError as e:
        logging.error(e.response)
        logging.error(e.response['Error']['Message'])


def __generate_confirmation_url(job: JobDocument):
    return "%s/jobs/confirm/%s" % (INTERNSHIPPER_APP_URL, job.id)
