from typing import Iterable
from fastapi import FastAPI
from db import Job as JobDocument
from models import CreateJob

app = FastAPI()


@app.post("/jobs")
def register(job: CreateJob):
    # TODO register to scheduler
    document = JobDocument(email=job.email, request=job.request,
                           password=job.password, user=job.user)
    document.save()
    return {"success": True, "result": document.to_json()}


@app.get("/jobs/delete/:job_id")
def delete_job(job_id: str):
    """
    Removes a job from the collection.
    No authentication with the assumption the user
    has received this link from their email address
    """
    # TODO add additional protection eg. Nonce and link validity period
    document = JobDocument.get(id=job_id)
    document.delete()

    return {"success": True}
