#!/bin/bash

pushd $(dirname $(dirname $0))
export ENV="production"
pipenv run uvicorn app.server:app --host 127.0.0.1 --port 8000 >/var/log/server/app.log 2>&1 </dev/null &
popd
