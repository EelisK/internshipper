#!/bin/bash

pipenv shell
uvicorn app.server:app --host 127.0.0.1 --port 8000
