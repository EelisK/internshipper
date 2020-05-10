import os
import time
import logging
import jobiili
import helpers
import jsonschema

from args import args


USERNAME = os.environ.get("USERNAME")
PASSWORD = os.environ.get("PASSWORD")
del os.environ["USERNAME"]
del os.environ["PASSWORD"]

if __name__ == "__main__":
    if not USERNAME:
        logging.error("USERNAME not defined")
        exit(1)

    if not PASSWORD:
        logging.error("PASSWORD not defined")
        exit(1)

    client = jobiili.Client(USERNAME, PASSWORD)
    client.login()
    request_filter = helpers.format_request(args.request)
    while True:
        try:
            helpers.poll_jobs(client, args.request, {
                "exclude_advanced_students": args.exclude_advanced_students
            })
            time.sleep(args.interval)
        except KeyboardInterrupt:
            exit(0)
        except Exception as e:
            logging.error(e)
            exit(1)
