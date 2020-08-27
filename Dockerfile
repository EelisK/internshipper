FROM python:3.8.2 AS builder

WORKDIR /srv/app

COPY .aws/ /root/.aws

COPY Pipfile Pipfile.lock ./

RUN python -m pip install --upgrade pip
RUN pip install pipenv
RUN pipenv install --system --deploy --ignore-pipfile

EXPOSE ${PORT}

COPY . .