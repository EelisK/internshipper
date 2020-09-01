import os
import json
import datetime
import mongoengine

from jsonschema import Draft4Validator, validators
from app.crypto import encrypt

__DATABASE_NAME = os.environ.get('DATABASE_NAME')
__DATABASE_URL = os.environ.get('MONGODB_URL')

if not __DATABASE_NAME:
    raise Exception('DATABASE_NAME environment variable not provided')
if not __DATABASE_URL:
    raise Exception('DATABASE_NAME environment variable not provided')

mongoengine.connect(__DATABASE_NAME, host=__DATABASE_URL)


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

    def to_dict(self):
        dict_value = json.loads(self.to_json())
        dict_value['id'] = dict_value['_id']['$oid']
        del dict_value['_id']
        return dict_value

    def __format_request(self):
        with open('./app/request_schema.json', 'r') as schema:
            schema = json.loads(''.join(schema.readlines()))
            self.__extend_with_default(Draft4Validator)(
                schema).validate(self.request)
            return self.request

    def __extend_with_default(self, validator_class):
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