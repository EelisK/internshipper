#!/bin/bash

cd /srv/app/server
pipenv shell
celery -A lib.tasks worker -B -l info
