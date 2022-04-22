#!/bin/bash

npm run build 
docker build -t jembi/api-config-importer:latest .
rm config.js
