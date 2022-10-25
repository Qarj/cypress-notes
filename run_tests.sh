#!/bin/bash

RUN_TESTS_VERSION="2.0.1"

SPECS_ROOT=$1
[ -z "${SPECS_ROOT}" ]  && SPECS_ROOT=./cypress/e2e

echo
echo
echo `date` "Started script run_test.sh"

echo Setting the current working directory to directory of this script
dir=$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
cd $dir

echo
echo The bamboo_target_environment is $bamboo_target_environment
echo The bamboo_team_name is $bamboo_team_name
echo

bash environment_info.sh

# workaround for Cypress > 9 on Ubuntu Docker https://github.com/cypress-io/cypress/issues/2821#issuecomment-444109124
# https://github.com/cypress-io/cypress-docker-images/issues/555
[ -z "${bamboo_managed_by}" ] || export HOME=$(pwd)/cache
[ -z "${bamboo_managed_by}" ] || export CYPRESS_CACHE_FOLDER=$(pwd)/cache
[ -z "${bamboo_managed_by}" ] || mkdir -p $(pwd)/cache

# when running on github actions, the CYPRESS_CACHE_FOLDER is set to /home/runner/.cache/Cypress

# detect if running on github actions
#[ -z "${GITHUB_ACTIONS}" ] || export CYPRESS_CACHE_FOLDER=/home/runner/.cache/Cypress

time apt install upower -y

# stop a lot of mess in the plain text logs
[ -z "${bamboo_managed_by}" ] || export NO_COLOR=1

# maybe fix gpu when running on CI and taking screenshots
export ELECTRON_EXTRA_LAUNCH_ARGS=--disable-gpu
export LIBVA_DRIVER_NAME=--disable-software-rasterizer

echo 
echo "Running npm ci (required by Bamboo)"
echo

time npm ci

[ -z "${bamboo_managed_by}" ] || echo "Installing netcat for checking if the needed endpoints are reachable"
[ -z "${bamboo_managed_by}" ] || time apt install netcat -y

echo
echo "Running specs in specs root ${SPECS_ROOT}"

time node runSpecsParallel.js ${SPECS_ROOT}
