import os
import json
import logging
import boto3
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
    except ClientError as aws_exception:
        logging.error(aws_exception.response['Error']['Code'])
        raise aws_exception
    else:
        if 'SecretString' in get_secret_value_response:
            return json.loads(get_secret_value_response['SecretString'])

        raise Exception('Expected "SecretString" to be provided')


if os.environ.get('ENV') == 'production':
    for key, value in get_secret().items():
        os.environ[key] = value
