from typing import Optional
from pydantic import BaseModel


class Options(BaseModel):
    include_advanced_students: bool


class CreateJob(BaseModel):
    email: str
    request: dict
    password: str
    user: str
    options: Optional[Options] = None
