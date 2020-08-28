from typing import Optional
from pydantic import BaseModel


class CreateJob(BaseModel):
    email: str
    request: dict
    password: str
    user: str
    options: dict
