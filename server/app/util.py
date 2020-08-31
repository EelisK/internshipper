from fastapi.templating import Jinja2Templates
import html2text
import datetime
import requests
import logging
import jobiili
import crypto
import db

from botocore.exceptions import ClientError
import boto3


__TEMPLATES = Jinja2Templates(directory="./app/templates")
__AWS_REGION = "eu-central-1"
ses_client = boto3.client('ses', region_name=__AWS_REGION)


def poll_jobs(job: db.Job):
    try:
        client = jobiili.Client(crypto.decrypt(
            job.user), crypto.decrypt(job.password))
        jobs = client.get_jobs(job.request)
        curr_jobs = apply_custom_options(jobs, job.options)
        [__inform_new_job(new_job, job)
         for new_job in __extract_new_jobs(job.found_jobs, curr_jobs)]
        if len(jobs) != 0:
            job.update(found_jobs=[*job.found_jobs, *jobs])
        logging.info("{} Poll complete for job {}".format(
            datetime.datetime.utcnow(), job.id))
    except requests.exceptions.ConnectionError:
        logging.warn("Got a connection issue while polling {}".format(job.id))
    except requests.exceptions.ReadTimeout:
        logging.error("Read time-out occurred")
    except requests.exceptions.RequestException as e:
        logging.error("Request failed with an exception: " + str(e))
    except:
        logging.error(
            "Unknown error occurred while polling job {}".format(job.id))


def create_html_email_from_template(template: str, *args, **kwargs):
    return __TEMPLATES.get_template(template).render(*args, **kwargs)


def create_plaintext_email_from_template(template: str, *args, **kwargs):
    rendered_html = create_html_email_from_template(template, *args, **kwargs)
    return html2text.html2text(rendered_html)


def apply_custom_options(jobs, options):
    if options.get("exclude_advanced_students"):
        return list(filter(
            lambda job: not job["advancedStudentsOnly"], jobs))
    return jobs


def __extract_new_jobs(prev_list, curr_list):
    prev_ids = map(lambda job: job["id"], prev_list)
    curr_ids = map(lambda job: job["id"], curr_list)
    new_ids = [x for x in curr_ids if x not in prev_ids]
    return list(filter(lambda job: job["id"] in new_ids, curr_list))


def __inform_new_job(job_from_jobiili: dict, job: db.Job):
    try:
        template = "new_job.html"
        response = ses_client.send_email(
            Destination={
                'ToAddresses': [job.email],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': create_html_email_from_template(template, **job_from_jobiili),
                    },
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': create_plaintext_email_from_template(template, **job_from_jobiili),
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
