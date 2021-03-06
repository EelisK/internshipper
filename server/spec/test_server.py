import unittest
from unittest.mock import patch
from fastapi.testclient import TestClient
from mocks import JOBIILI_REQUEST, JOBIILI_RESPONSE

from app.server import app
from app.exceptions import UnauthorizedException
from app.jobiili import Client as JobiiliClient
from app.db import Job as JobDocument
from mailers.sender import Sender as EmailSender


# pylint: disable=unused-argument
def mock_login(self, *args, **kwargs):
    self.identity = "mock-identity"
    return True


# pylint: disable=unused-argument
def mock_send(self, *args, **kwargs):
    return True


# pylint: disable=unused-argument
def raise_exception(*args, **kwargs):
    raise UnauthorizedException("")


class ServerTest(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    @patch.object(JobiiliClient, 'login', mock_login)
    @patch.object(EmailSender, 'send_email', mock_send)
    def test_post_jobs_valid(self):
        response = self.client.post("/jobs", json={
            "user": "username",
            "email": "user@domain.tld",
            "password": "password123",
            "options": {},
            "request": JOBIILI_REQUEST
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            {"success": True, "identity": "mock-identity"}, response.json())

    def test_post_jobs_invalid_data(self):
        response = self.client.post("/jobs", json={
            "user": None,
            "email": None,
            "password": None,
            "options": None,
            "request": None
        })
        self.assertEqual(response.status_code, 422)

    def test_post_jobs_missing_data(self):
        response = self.client.post("/jobs", json={"foo": "bar"})
        self.assertEqual(response.status_code, 422)

    @patch.object(JobiiliClient, 'login', raise_exception)
    def test_invalid_platform_credentials(self):
        response = self.client.post("/jobs", json={
            "user": "username",
            "email": "user@domain.tld",
            "password": "invalid-password",
            "options": {},
            "request": JOBIILI_REQUEST
        })
        self.assertEqual(response.status_code, 401)
        self.assertEqual({"detail": ""}, response.json())

    def test_delete_jobs(self):
        mock_job = ServerTest.create_mock_job()
        response = self.client.get("/jobs/delete/%s" %
                                   mock_job.id, allow_redirects=False)
        self.assertEqual(response.status_code, 307)
        self.assertIn("location", response.headers)
        self.assertRegex(response.headers["location"], "^/#data=")

    def test_delete_jobs_large_payload(self):
        mock_job = ServerTest.create_mock_job()
        mock_job.update(found_jobs=JOBIILI_RESPONSE * 100)

        response = self.client.get("/jobs/delete/%s" %
                                   mock_job.id, allow_redirects=False)
        self.assertEqual(response.status_code, 307)
        self.assertIn("location", response.headers)
        self.assertLess(len(response.headers["location"]), 32*1000)
        self.assertRegex(response.headers["location"], "^/#data=")

    def test_delete_jobs_not_found(self):
        non_existant_id = "555555555555555555555555"
        response = self.client.get("/jobs/delete/%s" % non_existant_id)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(
            {"detail": "Job with id 555555555555555555555555 not found"}, response.json())

    def test_confirm_jobs(self):
        mock_job = ServerTest.create_mock_job()
        response = self.client.get("/jobs/confirm/%s" %
                                   mock_job.id, allow_redirects=False)
        self.assertEqual(response.status_code, 307)
        self.assertIn("location", response.headers)
        self.assertRegex(response.headers["location"], "^/#data=")

    def test_confirm_jobs_already_confirmed(self):
        mock_job = ServerTest.create_mock_job()
        mock_job.update(confirmed=True)
        response = self.client.get("/jobs/confirm/%s" % mock_job.id)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            {"detail": "Subscription already confirmed"}, response.json())

    def test_confirm_jobs_not_found(self):
        non_existant_id = "555555555555555555555555"
        response = self.client.get("/jobs/confirm/%s" %
                                   non_existant_id, allow_redirects=False)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(
            {"detail": "Job with id 555555555555555555555555 not found"}, response.json())

    @staticmethod
    def create_mock_job():
        mock_job = JobDocument(email="email@domain.tld", request=JOBIILI_REQUEST,
                               password="password123", user="username", options={})
        mock_job.save()
        return mock_job
