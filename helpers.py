import datetime
import requests
import logging
import jobiili
import json

from jsonschema import Draft4Validator, validators


def poll_jobs(client, filters):
    try:
        jobs = client.get_jobs(filters)
        curr_jobs = filter_eligible_jobs(jobs)
        prev_jobs = get_old_jobs()
        [handle_new_job(job) for job in get_new_jobs(prev_jobs, curr_jobs)]
        update_job_list(curr_jobs)
        logging.info("{} Poll complete".format(datetime.datetime.utcnow()))
    except requests.exceptions.ConnectionError:
        logging.info("Exception occurred. Attempting re-login")
        client.login()
        poll_jobs(client, filters)
    except requests.exceptions.ReadTimeout:
        logging.error("Read time-out occurred")
    except requests.exceptions.BaseHTTPError as e:
        logging.error("Http error: " + str(e))


def filter_eligible_jobs(jobs):
    return list(filter(
        lambda job: not job["advancedStudentsOnly"], jobs))


def get_old_jobs():
    with open("polls.json") as json_file:
        return json.load(json_file)


def update_job_list(job_list):
    with open("polls.json", "w") as outfile:
        json.dump(job_list, outfile)


def get_new_jobs(prev_list, curr_list):
    prev_ids = map(lambda job: job["id"], prev_list)
    curr_ids = map(lambda job: job["id"], curr_list)
    new_ids = [x for x in curr_ids if x not in prev_ids]
    return list(filter(lambda job: job["id"] in new_ids, curr_list))


def format_request(request_file):
    with open(request_file, "r") as req_file:
        req_json = json.loads("".join(req_file.readlines()))
        with open("./schemas/request.json", "r") as schema:
            schema = json.loads("".join(schema.readlines()))
            extend_with_default(Draft4Validator)(schema).validate(req_json)
            return req_json


def extend_with_default(validator_class):
    validate_properties = validator_class.VALIDATORS["properties"]

    def set_defaults(validator, properties, instance, schema):
        for property_, subschema in properties.items():
            if "default" in subschema and not isinstance(instance, list):
                instance.setdefault(property_, subschema["default"])

        for error in validate_properties(validator, properties, instance, schema):
            yield error

    return validators.extend(
        validator_class, {"properties": set_defaults},
    )


def handle_new_job(job):
    data = {
        "name": "Internal Comms",
        "subject": "Job hunt",
        "email": "noreply@kostiainen.dev",
        "text": "jobName: {}\norgName: {}".format(job["jobName"], job["orgName"])
    }
    requests.post("https://kostiainen.dev/contact/tg", data=data)
