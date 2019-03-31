#!/bin/sh

PORT="${DEBUG_PORT:-41504}"

echo "Starting server in debug mode on port ${PORT}"
exec node --nolazy -r ts-node/register --inspect=${PORT} src/server/main.ts