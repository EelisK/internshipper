import datetime
import requests
import logging
import jobiili
import crypto
import db

from botocore.exceptions import ClientError
import boto3


__AWS_REGION = "eu-central-1"


def poll_jobs(job: db.Job):
    try:
        client = jobiili.Client(crypto.decrypt(
            job.user), crypto.decrypt(job.password))
        jobs = client.get_jobs(job.request)
        curr_jobs = __apply_additional_filters(jobs, job.options)
        [__inform_new_job(new_job, job)
         for new_job in __extract_new_jobs(job.found_jobs, curr_jobs)]
        if len(jobs) != 0:
            job.found_jobs = [*job.found_jobs, *jobs]
            job.save()
        logging.info("{} Poll complete for job {}".format(
            datetime.datetime.utcnow(), job.id))
    except requests.exceptions.ConnectionError:
        logging.warn("Exception occurred. Attempting re-login")
        client.login()
        poll_jobs(job)
    except requests.exceptions.ReadTimeout:
        logging.error("Read time-out occurred")
    except requests.exceptions.RequestException as e:
        logging.error("Request failed with an exception: " + str(e))
    except:
        logging.error(
            "Unknown error occurred while polling job {}".format(job.id))


def __apply_additional_filters(jobs, options):
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
    # TODO send email to job.email composed of job_from_jobiili
    client = boto3.client('ses', region_name=__AWS_REGION)
    try:
        response = client.send_email(
            Destination={
                'ToAddresses': [job.email],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': __format_internship_position_response_html(job_from_jobiili),
                    },
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': __format_internship_position_response_plaintext(job_from_jobiili),
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


def __format_internship_position_response_html(response: dict):
    """
    example response:
    {
        "id": 34368,
        "authorId": 54839,
        "endDate": "2020-12-20T12:00:00.000Z",
        "minPeriod": 1,
        "organizationId": 4779,
        "startDate": "2020-08-31T12:00:00.000Z",
        "status": "published",
        "maxTotalPersons": 5,
        "primarySchools": [
        {
            "id": 1086,
            "name": "Kajaanin Ammattikorkeakoulu Oy",
            "nameSwe": null,
            "abbreviation": "KAMK"
        }
        ],
        "jobName": null,
        "advancedStudentsOnly": null,
        "orgName": "Kainuun sosiaali- ja terveydenhuollon kuntayhtymä - Kainuun keskussairaala, ihotautien ja keuhkosairauksien poliklinikat",
        "orgAbbreviation": null,
        "jobWeeks": "9",
        "totalStudents": "5",
        "availability": [2, 2, 2, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        "publicationDate": "2020-03-24T10:00:00.000Z",
        "publicationDate2": "2020-04-20T06:00:00.000Z",
        "publicationEndDate": "2020-12-31T21:59:00.000Z",
        "total": "22"
    }
    """
    return """
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>New Internsihp Position</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
</head>
<body>
    {content}
</body>
</html>
    """.format(content=__format_internship_position_response_plaintext(response))


def __format_internship_position_response_plaintext(response: dict):
    return """
Found a new internship position matching your criteria.

Organization: {org}
Jobiili link: https://www.jobiili.fi/#/job/{jobId}
""".format(org=response.get("orgName", "unknown"), jobId=response.get("id"))
