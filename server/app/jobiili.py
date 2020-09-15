import requests
import os
import datetime
import bs4
import json

from app.exceptions import UnauthorizedException, ForbiddenException
from app.adapters import TLSAdapter


BASE_URL = "https://www.jobiili.fi"
API_URL = BASE_URL + "/api"
METROPOLIA_IDP_URL = "https://idp.metropolia.fi/idp/profile/SAML2/Redirect/SSO"


class Client:
    def __init__(self, username, password):
        self.session = requests.Session()
        if os.environ.get('ENV') == 'development':
            self.session.mount('https://', TLSAdapter())
        self.username = username
        self.password = password
        self.identity = None
        self.authorization = None

    def login(self):
        self.__initialize_session_for_login()
        response = self.__perform_metropolia_idp_login()
        response = self.__invoke_successful_idp_login_callback(response)
        self.authorization = self.__parse_authorization_from_login_callback(
            response
        )
        self.__perform_identity_check()

    def get_jobs(self, payload):
        response = requests.get(API_URL + "/Jobs/search?query=" + json.dumps(payload), headers={
                                "authorization": self.authorization, "Content-Type": "application/json"})
        if response.status_code != 200:
            raise ForbiddenException()
        return response.json()

    def __initialize_session_for_login(self):
        response = self.session.get(BASE_URL)
        response.raise_for_status()
        response = self.session.get(
            BASE_URL + "/Shibboleth.sso/Login?SAMLDS=1&&target=ss%3Amem%3A37145caa43527f537365280be5ad3ba0b03419c4fb1f3645bce1864341006721&entityID=https%3A%2F%2Fidp.metropolia.fi%2Fidp"
        )
        response.raise_for_status()

    def __perform_metropolia_idp_login(self):
        response = self.session.post(
            METROPOLIA_IDP_URL + "?execution=e1s1",
            data={
                "j_username": self.username,
                "j_password": self.password,
                "_eventId_proceed": "",
            },
        )
        response.raise_for_status()
        response_text = response.text
        if "The password you entered was incorrect." in response_text:
            raise UnauthorizedException("Incorrect password")
        if "The username you entered cannot be identified." in response_text:
            raise UnauthorizedException("Incorrect username.")
        return response

    def __invoke_successful_idp_login_callback(self, idp_login_response):
        response = self.session.post(
            BASE_URL + "/Shibboleth.sso/SAML2/POST",
            data=self.__parse_sso_login_data(idp_login_response)
        )
        response.raise_for_status()
        return response

    def __parse_sso_login_data(self, idp_login_response):
        soup = bs4.BeautifulSoup(idp_login_response.text, "lxml")
        form = soup.find("form")
        return {
            e.attrs["name"]: e.attrs["value"]
            for e in form.find_all("input")
            if "name" in e.attrs
        }

    def __parse_authorization_from_login_callback(self, jobiili_callback_response):
        location = jobiili_callback_response.history[0].headers["Location"]
        response = self.session.get(BASE_URL + location)
        response.raise_for_status()
        # Authorization format: /#/haka-redirect/<token>
        return location.split("/")[3]

    def __perform_identity_check(self):
        response = self.session.get(
            API_URL + "/People/getTokenDetails?token=" + self.authorization)
        response.raise_for_status()
        self.identity = response.json()
