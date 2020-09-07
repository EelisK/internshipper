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


class Sender:
    def __init__(self, template: str, **tempalte_kwargs):
        self.__templates = Jinja2Templates(directory="./email/templates")
        self.__aws_region = "eu-central-1"
        self.template = template
        self.ses_client = boto3.client('ses', region_name=self.__aws_region)
        self.tempalte_kwargs = tempalte_kwargs

    def create_html_email_from_template(self, *args, **kwargs):
        return self.__templates.get_template(self.template).render(*args, **kwargs)

    def create_plaintext_email_from_template(self, *args, **kwargs):
        rendered_html = self.create_html_email_from_template(
            self.template, *args, **kwargs)
        return html2text.html2text(rendered_html)

    def send_email(self, email_to: str, email_from: str, subject: str):
        try:
            response = self.ses_client.send_email(
                Destination={
                    'ToAddresses': [email_to],
                },
                Message={
                    'Body': {
                        'Html': {
                            'Charset': 'UTF-8',
                            'Data': self.create_html_email_from_template(**self.tempalte_kwargs),
                        },
                        'Text': {
                            'Charset': 'UTF-8',
                            'Data': self.create_plaintext_email_from_template(**self.tempalte_kwargs),
                        },
                    },
                    'Subject': {
                        'Charset': 'UTF-8',
                        'Data': subject,
                    },
                },
                Source=email_from
                # If you are not using a configuration set, comment or delete the following line
                # ConfigurationSetName="ConfigSet",
            )
            logging.info("Email sent (id: {})".format(response['MessageId']))
        except ClientError as e:
            logging.error(e.response)
            logging.error(e.response['Error']['Message'])
