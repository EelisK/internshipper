import unittest
from app import crypto


class CryptoTest(unittest.TestCase):
    def test_encrypt(self):
        self.assertIsNot(crypto.encrypt("foo"), "foo")

    def test_decrypt(self):
        self.assertEqual(crypto.decrypt(crypto.encrypt("foo")), "foo")
