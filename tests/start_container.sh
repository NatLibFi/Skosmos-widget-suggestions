#!/bin/bash

if [[ -n "${GITHUB_WORKSPACE}" ]]; then
    BASE_PATH="${GITHUB_WORKSPACE}"
else
    BASE_PATH="."
fi

echo "$BASE_PATH"

docker run -d -p 9090:80 \
  -v "$BASE_PATH/tests/testconfig.ttl:/var/www/html/config.ttl" \
  -v "$BASE_PATH/plugin/:/var/www/html/plugins/suggestion-plugin/" \
  quay.io/natlibfi/skosmos
