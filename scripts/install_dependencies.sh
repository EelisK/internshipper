#!/bin/bash

# Install python 3.8
apt update -y
apt install software-properties-common -y
add-apt-repository ppa:deadsnakes/ppa -y
apt install python3.8 -y
apt-get install python3.8-distutils -y
apt-get install python3.8-gdbm -y
ln -sf /usr/bin/python3.8 /usr/bin/python3

# Install pip
curl https://bootstrap.pypa.io/get-pip.py | python3 -
python3 -m pip install --upgrade pip

# Install dependencies
pip3 install pipenv
# pipenv install --system --deploy --ignore-pipfile
pipenv install
