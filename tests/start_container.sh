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

# Wait for HTTP 200 from the app (timeout ~60s)
for i in {1..60}; do
  if curl -sSf http://localhost:9090/yso/fi/ >/dev/null 2>&1; then
    echo "Service ready"
    exit 0
  fi
  echo "Waiting for service... ($i/60)"
  sleep 1
done

echo "Service did not start in time; dumping logs"
docker logs skosmos_test || true
exit 1
