#!/bin/sh
set -xe

name="$1"
repo="$2"
remote_name="${3:-$1}"
remote="$repo/$remote_name"

docker images
docker tag $name $remote
docker push $remote