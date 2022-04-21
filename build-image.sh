#!/bin/bash

npm run build 
docker build -t jembi/api-config-importer:temp . 
rm config.js
