import unittest
from unittest.mock import patch
from mocks import JOBIILI_REQUEST, JOBIILI_RESPONSE

from app.db import Job as JobDocument
from lib import tasks


class TasksTest(unittest.TestCase):
    @patch('app.jobiili.Client.login')
    @patch('app.jobiili.Client.get_jobs')
    def test_perform_job_polling_no_new_jobs(self, mock_get_jobs, mock_login):
        mock_get_jobs.return_value = []
        mock_job = TasksTest.create_mock_job()

        tasks.perform_job_polling(mock_job.to_dict())

        mock_login.assert_called_once()
        mock_get_jobs.assert_called_once()
        mock_get_jobs.assert_called_with(mock_job.request)

    @patch('app.jobiili.Client.login')
    @patch('app.jobiili.Client.get_jobs')
    @patch('mailers.sender.Sender.send_email')
    def test_perform_job_polling_new_jobs_found(self, mock_send_email, mock_get_jobs, mock_login):
        mock_get_jobs.return_value = JOBIILI_RESPONSE
        mock_job = TasksTest.create_mock_job()

        tasks.perform_job_polling(mock_job.to_dict())

        mock_login.assert_called_once()
        mock_get_jobs.assert_called_once()
        mock_get_jobs.assert_called_with(mock_job.request)
        mock_send_email.assert_called_once()
        mock_send_email.assert_called_with(
            email_to=mock_job.email,
            email_from="internshipper.io <no-reply@internshipper.io>",
            subject="New Internship Positions",
            template_params={
                "jobs": [
                    {**JOBIILI_RESPONSE[0], "jobWeeksContinuous": 1},
                    {**JOBIILI_RESPONSE[1], "jobWeeksContinuous": 17}
                ],
                "delete_link": "https://test.internshipper.io/jobs/delete/%s" % mock_job.id
            }
        )

    @patch('app.jobiili.Client.login')
    @patch('app.jobiili.Client.get_jobs')
    @patch('mailers.sender.Sender.send_email')
    def test_perform_job_polling_new_jobs_exclude_advanced_students(self, mock_send_email, mock_get_jobs, mock_login):
        mock_get_jobs.return_value = JOBIILI_RESPONSE
        mock_job = TasksTest.create_mock_job(
            options={"exclude_advanced_students": True})

        tasks.perform_job_polling(mock_job.to_dict())

        mock_login.assert_called_once()
        mock_get_jobs.assert_called_once()
        mock_get_jobs.assert_called_with(mock_job.request)
        mock_send_email.assert_called_once()
        mock_send_email.assert_called_with(
            email_to=mock_job.email,
            email_from="internshipper.io <no-reply@internshipper.io>",
            subject="New Internship Position",
            template_params={
                "jobs": [
                    {**JOBIILI_RESPONSE[1], "jobWeeksContinuous": 17}
                ],
                "delete_link": "https://test.internshipper.io/jobs/delete/%s" % mock_job.id
            }
        )

    @patch('lib.tasks.perform_job_polling.s')
    @patch('app.db.Job.objects')
    def test_perform_bulk_job_polling(self, mock_objects, mock_perform_job_polling):
        mock_job_1 = TasksTest.create_mock_job(confirmed=True)
        mock_job_2 = TasksTest.create_mock_job(confirmed=True)
        mock_objects.return_value = [mock_job_1, mock_job_2]

        tasks.perform_bulk_job_polling()

        self.assertEqual(mock_objects.call_count, 1)
        self.assertEqual(mock_perform_job_polling.call_count, 2)

    @staticmethod
    def create_mock_job(**options):
        mock_job = JobDocument(
            email=options.get("email", "email@domain.tld"),
            request=options.get("request", JOBIILI_REQUEST),
            password=options.get("password", "password123"),
            user=options.get("user", "username"),
            options=options.get("options", {}),
            confirmed=options.get("confirmed", False)
        )
        mock_job.save()
        return mock_job
