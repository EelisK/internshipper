import os
import json
import datetime
import mongoengine

from jsonschema import Draft4Validator, validators
from app.crypto import encrypt

__DATABASE_URL = os.environ.get('MONGODB_URL')
if not __DATABASE_URL:
    raise Exception('MONGODB_URL environment variable not provided')

mongoengine.connect(host=__DATABASE_URL)


class Job(mongoengine.Document):
    email = mongoengine.StringField(required=True)
    request = mongoengine.DictField(required=True)
    created_at = mongoengine.DateTimeField()
    confirmed = mongoengine.BooleanField(required=True, default=False)
    # Array where found jobs for this request are kept
    # TODO add separate collection for this
    found_jobs = mongoengine.ListField(null=False, default=[])
    # Options that can be used for filtering
    # queries additionally to the standard request
    options = mongoengine.DictField(required=False)
    # Encrypted fields
    password = mongoengine.StringField(required=True)
    user = mongoengine.StringField(required=True)

    def save(self, *args, **kwargs):
        self.__format_request()
        self.created_at = datetime.datetime.now()
        self.user = encrypt(self.user)
        self.password = encrypt(self.password)
        return super().save(*args, **kwargs)

    def to_dict(self, remove_sensitive_data=False, minimize=False):
        dict_value = json.loads(self.to_json())
        dict_value['id'] = dict_value['_id']['$oid']
        dict_value['created_at'] = dict_value['created_at']['$date']
        del dict_value['_id']
        if remove_sensitive_data:
            del dict_value['user']
            del dict_value['password']
        if minimize:
            dict_value['found_jobs_count'] = len(dict_value['found_jobs'])
            del dict_value['found_jobs']
        return dict_value

    @staticmethod
    def get_by_id(job_id: str):
        return Job.objects.get(id=job_id)

    def __format_request(self):
        with open('./app/request_schema.json', 'r') as schema:
            schema = json.loads(''.join(schema.readlines()))
            Job.__extend_with_default(Draft4Validator)(
                schema).validate(self.request)
            return self.request

    @staticmethod
    def __extend_with_default(validator_class):
        validate_properties = validator_class.VALIDATORS['properties']

        def set_defaults(validator, properties, instance, schema):
            for property_, subschema in properties.items():
                if 'default' in subschema and not isinstance(instance, list):
                    instance.setdefault(property_, subschema['default'])

            for error in validate_properties(validator, properties, instance, schema):
                yield error

        return validators.extend(
            validator_class, {'properties': set_defaults},
        )
