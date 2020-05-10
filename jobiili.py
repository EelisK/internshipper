import requests
import os
import datetime
import bs4
import json
from exceptions import InvalidCredentials, AuthenticationException
from adapters import TLSAdapter


BASE_URL = "https://www.jobiili.fi"
API_URL = BASE_URL + "/api"


class Client:
    def __init__(self, username, password):
        self.session = requests.Session()
        self.session.mount('https://', TLSAdapter())
        self.username = username
        self.password = password
        self.authorization = None

    def login(self):
        response = self.session.get(BASE_URL)
        response.raise_for_status()

        response = self.session.get(
            BASE_URL + "/Shibboleth.sso/Login?SAMLDS=1&&target=ss%3Amem%3A37145caa43527f537365280be5ad3ba0b03419c4fb1f3645bce1864341006721&entityID=https%3A%2F%2Fidp.metropolia.fi%2Fidp"
        )
        response.raise_for_status()

        response = self.session.post(
            "https://idp.metropolia.fi/idp/profile/SAML2/Redirect/SSO?execution=e1s1",
            data={
                "j_username": self.username,
                "j_password": self.password,
                "_eventId_proceed": "",
            },
        )
        response.raise_for_status()

        if "The password you entered was incorrect." in response.text:
            raise InvalidCredentials()

        soup = bs4.BeautifulSoup(response.text, "lxml")
        form = soup.find("form")
        data = {
            e.attrs["name"]: e.attrs["value"]
            for e in form.find_all("input")
            if "name" in e.attrs
        }

        response = self.session.post(
            BASE_URL + "/Shibboleth.sso/SAML2/POST", data=data)
        response.raise_for_status()

        location = response.history[0].headers["Location"]
        self.authorization = location.split("/")[3]

        response = self.session.get(BASE_URL + location)
        response.raise_for_status()

        response = self.session.get(
            API_URL + "/People/getTokenDetails?token=" + self.authorization)
        self.identity = response.json()

    def get_jobs(self, payload):
        response = requests.get(API_URL + "/Jobs/search?query=" + json.dumps(payload), headers={
                                "authorization": self.authorization, "Content-Type": "application/json"})
        if response.status_code != 200:
            raise AuthenticationException()
        return response.json()
