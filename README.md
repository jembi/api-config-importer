# Generic Config Importer

A generic config importer which makes an API call to configure services running in a Docker swarm.

## Where can this be used?

- In a Docker swarm
- Anywhere you're making a POST request to an API to import configs

## Requirements

- npm
- Docker

## Usage

[Docker Image](https://hub.docker.com/r/jembi/api-config-importer)

To use the config importer, you have to specify a docker-compose file. The compose file must look as follows, with `SERVICE` referring to the service to be configured.

```yml
version: "3.9"

services:
  <service to configure>-config-importer:
    image: jembi/config-importer:<version-tag>
    environment:
      HTTP_METHOD: <http method>
      SERVICE_NAME: <service name>
      SERVICE_API_PORT: <service port>
      API_USERNAME: <service username>
      API_PASSWORD: <service password>
      SSL: <true/false>
      API_PATH: <service config endpoint>
      MIME_TYPE: <mime type>
      CONFIG_FILE: <config file name>
      ADDITIONAL_HEADERS: <additional headers in JSON format>
    deploy:
      replicas: 1
      restart_policy:
        condition: none
```

- HTTP_METHOD --> The the http verb you wish to use ("POST", "PUT", etc)
- SERVICE_NAME --> The name of the service as specified in that service's compose file
- SERVICE_API_PORT --> The port the service listens on from within the docker swarm (not the routed port)
- SSL --> Set to true for a service running in secure (`https`) mode, and false otherwise
- API_PATH --> The API endpoint the targeted API uses to import configs
- MIME_TYPE --> Currently supported options = `multipart/form-data`, `application/json`. Specify this field based on the request body data format
- CONFIG_FILE --> The name of the config file which forms part of the API request body
- ADDITIONAL_HEADERS --> Includes headers needed to complete the API call. MUST take the form of a json object, i.e.,

```yml
  ADDITIONAL_HEADERS: '{
    "header1": "value1",
    "header2": "value2"
  }'
```

The config importer depends on files placed in the config raft to attach as part of the request body. So, remember to specify your configs in the compose file.

## Building locally

To build the config-importer image locally, simply run `./build-image.sh` from the api-config-importer root directory.

## Notes

- Remember to remove stale configs on the Docker config raft, so that those configs can be subsequently updated
