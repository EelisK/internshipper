#!/bin/bash

module_directories=$(find . -name __init__.py -print0 | xargs -0 -n1 dirname | sort --unique)
pylint --rcfile=.pylintrc --fail-under=9 $module_directories
