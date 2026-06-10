#!/bin/bash

if [[ -n "${GITHUB_WORKSPACE}" ]]; then
    BASE_PATH="${GITHUB_WORKSPACE}"
else
    BASE_PATH="."

    docker ps -aq --filter "ancestor=quay.io/natlibfi/skosmos:latest" | xargs -r docker stop | xargs -r docker rm
fi

docker run -d -p 9090:80 \
  -v "$BASE_PATH/tests/testconfig.ttl:/var/www/html/config.ttl" \
  -v "$BASE_PATH/plugin/:/var/www/html/plugins/suggestions/" \
  quay.io/natlibfi/skosmos:latest
