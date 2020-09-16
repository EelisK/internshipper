FROM python:3.8 AS builder

WORKDIR /srv/app

COPY Pipfile Pipfile.lock ./

RUN python -m pip install --upgrade pip
RUN pip install pylint pylint_mongoengine
RUN pip install pipenv
RUN pipenv install --system --ignore-pipfile

EXPOSE ${PORT}

COPY . .
