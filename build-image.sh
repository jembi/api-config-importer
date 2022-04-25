#!/bin/bash

npm ci --production && npm clean cache --force
npm run build 
docker build -t jembi/api-config-importer:latest .
rm config.js
