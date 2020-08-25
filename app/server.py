from util import poll_jobs
from exceptions import BadRequestException
from jobiili import Client as JobiiliClient
from models import CreateJob
from db import Job as JobDocument
from fastapi import FastAPI
from typing import Iterable
import mongoengine


app = FastAPI()


@app.post("/jobs")
def register(job: CreateJob):
    # TODO send email with confirmation link
    client = JobiiliClient(job.user, job.password)
    client.login()
    document = JobDocument(email=job.email, request=job.request,
                           password=job.password, user=job.user, options=job.options)
    try:
        document.save()
        return {"success": True}
    except:
        raise BadRequestException("Jobiili request was likely malformed")


@app.get("/jobs/delete/:job_id")
def delete_job(job_id: str):
    """
    Removes a job from the collection.
    No authentication with the assumption the user
    has received this link from their email address
    """
    # TODO add additional protection eg. Nonce and link validity period
    document = JobDocument.get(id=mongoengine.ObjectId(job_id))
    document.delete()

    return {"success": True}


@app.get("/jobs/confirm/:job_id")
def confirm_job(job_id: str):
    # TODO start polling for the job when this link is opened
    # document = JobDocument.get(id=job_id)
    # start_polling(...document)
    # TODO add nonce and/or other forms of validation
    # TODO redirect to internshipper url and render success message there
    return {"success": True}
