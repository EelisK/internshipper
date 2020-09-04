from app import db
from app import crypto
from app import jobiili
from fastapi.templating import Jinja2Templates

import html2text
import datetime
import requests
import logging

from botocore.exceptions import ClientError
import boto3


__TEMPLATES = Jinja2Templates(directory="./templates")
__AWS_REGION = "eu-central-1"
ses_client = boto3.client('ses', region_name=__AWS_REGION)


def create_html_email_from_template(template: str, *args, **kwargs):
    return __TEMPLATES.get_template(template).render(*args, **kwargs)


def create_plaintext_email_from_template(template: str, *args, **kwargs):
    rendered_html = create_html_email_from_template(template, *args, **kwargs)
    return html2text.html2text(rendered_html)
