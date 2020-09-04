#!/bin/bash

pushd $(dirname $(dirname $0))
export ENV="production"
pipenv run celery -A lib.tasks worker -B -l info >/var/log/server/worker.log 2>&1 </dev/null &
popd
