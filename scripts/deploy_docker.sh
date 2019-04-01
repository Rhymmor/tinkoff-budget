#!/bin/sh
set -xe

docker images
docker tag $1 $2/$1
docker push $2/$1