import os
from cryptography.fernet import Fernet

__ENCRYPTION_KEY = os.environ.pop("ENCRYPTION_KEY").encode()
if not __ENCRYPTION_KEY:
    raise Exception("ENCRYPTION_KEY environment variable not set")


def encrypt(value: str):
    return Fernet(__ENCRYPTION_KEY).encrypt(value.encode()).decode()


def decrypt(value: str):
    return Fernet(__ENCRYPTION_KEY).decrypt(value.encode()).decode()
