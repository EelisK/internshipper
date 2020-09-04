#!/bin/bash

pushd $(dirname $(dirname $0))
pipenv install
popd
