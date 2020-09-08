import lib.setup

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from botocore.exceptions import ClientError
from mongoengine.errors import DoesNotExist
from typing import Iterable

from lib.tasks import app as celery_app, POLLING_INTERVAL, perform_job_polling
from lib.config import INTERNSHIPPER_APP_URL
from app.exceptions import BadRequestException, NotFoundException
from app.jobiili import Client as JobiiliClient
from app.models import CreateJob
from app.db import Job as JobDocument
from mailers.sender import Sender as EmailSender

import mongoengine
import logging
import base64
import json
import os


app = FastAPI()


@app.post("/jobs")
def register(job: CreateJob):
    """
    Create a job and add it to a staging environment.
    The job will need to be confirmed via email before it's added to the worker.
    Performs platform credential validation.
    """
    client = JobiiliClient(job.user, job.password)
    client.login()
    document = JobDocument(email=job.email, request=job.request,
                           password=job.password, user=job.user, options=job.options)
    try:
        document.save()
        email_sender = EmailSender("confirm.html")
        template_params = {
            "confirmation_url": __generate_confirmation_url(document)}
        email_sender.send_email(
            email_to=document.email,
            email_from="internshipper.io <no-reply@internshipper.io>",
            subject="Confirm your subscription to internshipper.io",
            template_params=template_params
        )
        return {"success": True, "identity": client.identity}
    except Exception as e:
        logging.error("Exception in job creation")
        logging.error(e)
        raise BadRequestException("Jobiili request was likely malformed")


@app.get("/jobs/delete/{job_id}", status_code=201)
def delete_job(job_id: str):
    """
    Removes a job from the collection.
    No authentication with the assumption the user
    has received this link from their email address.
    """
    document = __try_find_document(job_id)
    document_dict = document.to_dict(remove_sensitive_data=True)
    document.delete()

    return RedirectResponse("/#%s" % __compose_redirect_data({
        "action": "DELETE_JOB",
        "payload": document_dict
    }))


@app.get("/jobs/confirm/{job_id}")
def confirm_job(job_id: str):
    """
    Confirms the job and adds it to the worker as a periodic task.
    """
    document = __try_find_document(job_id)
    if not document.confirmed:
        document.update(confirmed=True)
        celery_app.add_periodic_task(
            POLLING_INTERVAL, perform_job_polling.s(document.to_dict()), name='fetch_job')

        return RedirectResponse("/#%s" % __compose_redirect_data({
            "action": "CONFIRM_JOB",
            "payload": document.to_dict(remove_sensitive_data=True)
        }))
    else:
        raise BadRequestException("Subscription already confirmed")


def __try_find_document(id: str):
    try:
        return JobDocument.objects.get(id=id)
    except DoesNotExist:
        raise NotFoundException("Job with id %s not found" % id)


def __generate_confirmation_url(job: JobDocument):
    return "%s/jobs/confirm/%s" % (INTERNSHIPPER_APP_URL, job.id)


def __compose_redirect_data(data: dict):
    json_string = json.dumps(data).encode("ascii")
    base64_string = base64.b64encode(json_string).decode("ascii")
    return "data=%s" % base64_string
