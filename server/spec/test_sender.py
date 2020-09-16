import unittest
from unittest.mock import patch, MagicMock
from mailers.sender import Sender


# pylint: disable=unused-argument
def create_mock_client(*args, **kwargs):
    class MockClient:
        def send_email(self, *args, **kwargs):
            pass
    mock_client = MockClient()
    mock_client.send_email = MagicMock()
    return mock_client


class SenderTest(unittest.TestCase):
    def test_create_html_email_from_template(self):
        sender = Sender("confirm.html")
        rendered_template = sender.create_html_email_from_template(
            confirmation_url="http://foo.bar/confirm")
        self.assertIsNotNone(rendered_template)
        self.assertTrue(isinstance(rendered_template, str))
        self.assertIn("http://foo.bar/confirm", rendered_template)

    def test_create_plaintext_email_from_template(self):
        sender = Sender("confirm.html")
        rendered_text = sender.create_plaintext_email_from_template(
            confirmation_url="http://foo.bar/confirm")

        self.assertIsNotNone(rendered_text)
        self.assertTrue(isinstance(rendered_text, str))
        self.assertIn("http://foo.bar/confirm", rendered_text)

    @patch('boto3.client', create_mock_client)
    def test_send_email(self):
        sender = Sender("confirm.html")
        sender.create_html_email_from_template = MagicMock(
            return_value="mock-html")
        sender.create_plaintext_email_from_template = MagicMock(
            return_value="mock-plaintext")

        sender.send_email(email_from="Test <test@internshipper.io>", email_to="user@domain.tld",
                          subject="Run unit test", template_params={'confirmation_url': 'http://foo.bar'})

        sender.ses_client.send_email.assert_called_once()
        sender.ses_client.send_email.assert_called_with(
            Destination={
                'ToAddresses': ["user@domain.tld"],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': 'mock-html',
                    },
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': 'mock-plaintext',
                    },
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': 'Run unit test',
                },
            },
            Source='Test <test@internshipper.io>'
        )
