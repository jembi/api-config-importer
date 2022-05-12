#!/bin/bash

npm ci --production && npm cache clean --force
npm run build 
docker build -t jembi/api-config-importer:latest .
rm config.js
