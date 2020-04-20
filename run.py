import os
import time
import json
import logging
import requests
import datetime
import jobiili
import fixtures


USERNAME = os.environ.get("USERNAME")
PASSWORD = os.environ.get("PASSWORD")

if not USERNAME:
    logging.error("USERNAME not defined")
    exit(1)

if not PASSWORD:
    logging.error("PASSWORD not defined")
    exit(1)

client = jobiili.Client(USERNAME, PASSWORD)


def poll_jobs():
    try:
        jobs = client.get_jobs(fixtures.REQUEST_FILTERS)
        curr_jobs = filter_eligible_jobs(jobs)
        prev_jobs = get_old_jobs()
        [handle_new_job(job) for job in get_new_jobs(prev_jobs, curr_jobs)]
        update_job_list(curr_jobs)
        print("{} Poll complete".format(datetime.datetime.utcnow()))
    except (jobiili.AuthenticationException, requests.exceptions.ConnectionError):
        logging.info("Exception occurred\nAttempting re-login")
        client.login()
        poll_jobs()
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


def handle_new_job(job):
    data = {
        "name": "Internal Comms",
        "subject": "Job hunt",
        "email": "noreply@kostiainen.dev",
        "text": "jobName: {}\norgName: {}".format(job["jobName"], job["orgName"])
    }
    requests.post("https://kostiainen.dev/contact/tg", data=data)


if __name__ == "__main__":
    while True:
        try:
            poll_jobs()
            time.sleep(fixtures.POLLING_INTERVAL)
        except KeyboardInterrupt:
            exit(0)
        except Exception as e:
            logging.error(e)
            exit(123)
