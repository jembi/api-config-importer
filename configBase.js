'use strict'

const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

const HTTP_METHOD = process.env.HTTP_METHOD ?? "POST"
const SERVICE_NAME = process.env.SERVICE_NAME
const API_PASSWORD = process.env.API_PASSWORD
const SERVICE_API_PORT = process.env.SERVICE_API_PORT
const API_PATH = process.env.API_PATH
const API_USERNAME = process.env.API_USERNAME
const SSL = process.env.SSL
const MIME_TYPE = process.env.MIME_TYPE
const CONFIG_FILE = process.env.CONFIG_FILE

let data
let dataHeaders = {}

switch (MIME_TYPE) {
  case 'multipart/form-data':
    data = new FormData()
    data.append('form', fs.createReadStream(path.resolve(__dirname, CONFIG_FILE)))
    dataHeaders = data.getHeaders()
    break;

  case 'application/json':
    const jsonData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, CONFIG_FILE))
    )
    data = JSON.stringify(jsonData)
    break;

  default:
    break;
}

const protocol = SSL == 'false' ? 'http' : 'https'

let config = {
  method: HTTP_METHOD,
  url: `${protocol}://${SERVICE_NAME}:${SERVICE_API_PORT}${API_PATH}`,
  auth: {
    username: API_USERNAME,
    password: API_PASSWORD
  },
  headers: {
    'Content-Type': MIME_TYPE,
    ...dataHeaders
  },
  data: data,
}

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data))
  })
  .catch(function (error) {
    console.log(error)
    process.exit(1)
  })
