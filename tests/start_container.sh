#!/bin/bash

if [[ -n "${GITHUB_WORKSPACE}" ]]; then
    BASE_PATH="${GITHUB_WORKSPACE}"
else
    BASE_PATH="."
fi

docker run -d -p 9090:80 \
  -v "$BASE_PATH/tests/testconfig.ttl:/var/www/html/config.ttl" \
  -v "$BASE_PATH/plugin/:/var/www/html/plugins/suggestion-plugin/" \
  -v "$BASE_PATH/node_modules/:/var/www/html/plugins/suggestion-plugin/node_modules/" \
  quay.io/natlibfi/skosmos
