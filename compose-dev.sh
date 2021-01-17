#!/bin/bash

export BACKEND_PORT=5000
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml "$@"
