import os
import datetime
import mongoengine
from crypto import encrypt

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

    # Encrypted fields
    password = mongoengine.StringField(required=True)
    user = mongoengine.StringField(required=True)

    def save(self, *args, **kwargs):
        self.created_at = datetime.datetime.now()
        self.user = encrypt(self.user)
        self.password = encrypt(self.password)
        return super(Job, self).save(*args, **kwargs)
