#!/bin/bash

sudo apt install ruby -y
wget https://aws-codedeploy-eu-central-1.s3.eu-central-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
service codedeploy-agent status
