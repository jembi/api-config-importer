FROM node:12-alpine

ADD config.js .

ENTRYPOINT [ "node", "config.js" ]
