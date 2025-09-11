#!/bin/bash

docker run -d -p 9090:80 \
  -v ./testconfig.ttl:/var/www/html/config.ttl \
  -v ../plugin/:/var/www/html/plugins/suggestion-plugin/ \
  quay.io/natlibfi/skosmos
