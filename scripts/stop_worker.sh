#!/bin/bash

# TODO: better shutdown logic
kill -9 $(pgrep celery)
