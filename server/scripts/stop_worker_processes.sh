#!/bin/bash

# TODO: better shutdown logic
workers=$(pgrep celery)
if [ -n "${workers}" ]; then
    kill -9 $workers
fi
