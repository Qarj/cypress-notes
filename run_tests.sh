#!/bin/bash

SPECS_ROOT=$1
[ -z "${SPECS_ROOT}" ]  && SPECS_ROOT=./cypress/integration

echo
echo
echo `date` "Started script run_test.sh"

echo Setting the current working directory to directory of this script
dir=$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
cd $dir

echo
echo The bamboo_target_environment is $bamboo_target_environment
echo

bash environment_info.sh

echo 
echo "Running npm ci"
echo

time npm ci

echo
echo "Running specs in specs root ${SPECS_ROOT}"

time node runSpecsParallel.js ${SPECS_ROOT}