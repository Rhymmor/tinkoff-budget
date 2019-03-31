#!/bin/sh
set -xe

docker images
docker tag tinkoff-budget $DOCKER_USERNAME/tinkoff-budget
docker push $DOCKER_USERNAME/tinkoff-budget