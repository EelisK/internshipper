import logging
import html2text
import boto3

from fastapi.templating import Jinja2Templates
from botocore.exceptions import ClientError


class Sender:
    def __init__(self, template: str):
        self.__templates = Jinja2Templates(directory="./mailers/templates")
        self.__aws_region = "eu-central-1"
        self.template = template
        self.ses_client = boto3.client('ses', region_name=self.__aws_region)

    def create_html_email_from_template(self, *args, **kwargs):
        return self.__templates.get_template(self.template).render(*args, **kwargs)

    def create_plaintext_email_from_template(self, *args, **kwargs):
        rendered_html = self.create_html_email_from_template(*args, **kwargs)
        return html2text.html2text(rendered_html)

    def send_email(self, email_to=None, email_from=None, subject=None, template_params={}):
        try:
            response = self.ses_client.send_email(
                Destination={
                    'ToAddresses': [email_to],
                },
                Message={
                    'Body': {
                        'Html': {
                            'Charset': 'UTF-8',
                            'Data': self.create_html_email_from_template(**template_params),
                        },
                        'Text': {
                            'Charset': 'UTF-8',
                            'Data': self.create_plaintext_email_from_template(**template_params),
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
            logging.info("Email sent (id: %s)", response['MessageId'])
        except ClientError as ses_exception:
            logging.error(ses_exception.response)
            logging.error(ses_exception.response['Error']['Message'])
