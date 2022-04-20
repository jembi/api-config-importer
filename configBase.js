'use strict'

const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

const SERVICE_NAME = process.env.SERVICE_NAME
const API_PASSWORD = process.env.API_PASSWORD
const SERVICE_API_PORT = process.env.SERVICE_API_PORT
const API_PATH = process.env.API_PATH
const API_USERNAME = process.env.API_USERNAME
const SSL = process.env.SSL
const CALLER_ID = process.env.CALLER_ID

let data
switch (CALLER_ID) {
  case 'jsr_config_importer':
    data = new FormData()
    data.append('form', fs.createReadStream(path.resolve(__dirname, 'export.jsrexport')))
    break;

  case 'openhim_config_importer':
    const jsonData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'openhim-import.json'))
    )
    data = JSON.stringify(jsonData)
    break;

  default:
    break;
}

let protocol
if (SSL == 'false') {
  protocol = 'http'
} else {
  protocol = 'https'
}

let config = {
  method: 'post',
  url: `${protocol}://${SERVICE_NAME}:${SERVICE_API_PORT}${API_PATH}`,
  auth: {
    username: API_USERNAME,
    password: API_PASSWORD
  },
  headers: {
    'Content-Type': 'application/json',
    ...data.getHeaders()
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
