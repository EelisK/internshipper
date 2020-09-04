import os
import json
import boto3
import base64
import logging
from botocore.exceptions import ClientError


def get_secret():
    secret_name = "internshipper-secret-env"
    region_name = "eu-central-1"

    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        logging.error(e.response['Error']['Code'])
        raise e
    else:
        if 'SecretString' in get_secret_value_response:
            return json.loads(get_secret_value_response['SecretString'])
        else:
            raise Exception('Expected "SecretString" to be provided')


if os.environ.get('ENV') == 'production':
    for key, value in get_secret().items():
        os.environ[key] = value
