#!/bin/bash

pipenv shell
celery -A lib.tasks worker -B -l info
