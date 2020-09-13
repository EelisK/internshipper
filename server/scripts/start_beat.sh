#!/bin/bash

pushd $(dirname $(dirname $0))
ENV="production" pipenv run celery -A lib.tasks beat >/var/log/server/beat.log 2>&1 </dev/null &
popd
