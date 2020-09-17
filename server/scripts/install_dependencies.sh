#!/bin/bash

pushd $(dirname $(dirname $0))
rm -rf /root/.local/share/virtualenvs/
mkdir -p /root/.local/share/virtualenvs/
pipenv install
popd
