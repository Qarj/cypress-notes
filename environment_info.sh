#!/bin/bash
ENV_INFO_VERSION="v1.0.1"

[ -z "${bamboo_managed_by}" ] && echo "Not running on bamboo, local run." && exit 0

echo
echo "Printing environment info for running container, ${ENV_INFO_VERSION}"
echo

echo
echo Printing hostname
hostname

echo
echo Printing host ip address
hostname -I

echo
echo Printing working directory
pwd

echo
echo Printing environment variables
printenv

echo
echo Checking npm --version
npm --version

echo
echo Checking node --version
node --version

echo
echo Checking uname -a
uname -a

echo
echo Checking cat /etc/issue
cat /etc/issue

echo
echo Checking cat /etc/os-Release
cat /etc/os-release

# lshw is not installed on Amazon Linux
time apt install lshw -y
echo
echo Running lshw -class disk -class storage
lshw -class disk -class storage

echo
echo Checking lscpu to list number of virtual CPU cores
lscpu

echo
echo Checking free -h
free -h

echo
echo Checking df -h
df -h

echo
echo Running cat /proc/sys/kernel/hostname
cat /proc/sys/kernel/hostname

echo
echo Running npx cypress info
time npx cypress info

echo
echo Running npx cypress --version
npx cypress --version
