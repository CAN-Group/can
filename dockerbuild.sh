#!/bin/bash

REPOSITORY="can/$(basename $PWD)"
VERSION=$1

BRANCH=$(git rev-parse --abbrev-ref HEAD)
BRANCH="${BRANCH/\//-}"

if [ "$BRANCH" = "master" ]; then
    TAGS=("$VERSION" "latest")
else
    TAGS=("${VERSION}-${BRANCH}" "dev")
fi;

docker build ${TAGS[@]/#/--tag $REPOSITORY:} .
