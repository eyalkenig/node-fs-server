#!/usr/bin/env bash
set -ev

DOCKERFILE=Dockerfile

docker build -t node-fs-server:latest -f $DOCKERFILE .