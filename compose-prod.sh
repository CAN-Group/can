#!/bin/bash

export BACKEND_PORT=80
docker-compose -f docker-compose.yaml "$@"
