#!/bin/bash

# TODO: improved server shutdown logic
process_id=$(netstat -nlp | grep :8000 | awk '{print $NF}' | awk -F "/" '{print $1}')
if [ -n "${process_id}" ]; then
    kill -9 $process_id
fi
