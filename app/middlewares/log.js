const morgan = require('morgan')
const logger = require('../helpers/logger')

const stream = {
  // Use the http winston level
  write: (message) => logger.http(message),
}

const skip = () => {
  const env = process.env.NODE_ENV || 'development'
  return env !== 'development'
}

morgan.token('reqBody', (req, res) => {
  if (res.statusCode !== 200) {
    return JSON.stringify(req.body) || JSON.stringify({})
  }
  return JSON.stringify({})
})

morgan.token('resBody', (_req, res) => {
  if (res.statusCode !== 200) {
    return res.customBody || JSON.stringify({})
  }
  return JSON.stringify({})
})

morgan.token('authorization', (req, res) => {
  if (res.statusCode !== 200) {
    return req.headers.authorization
  }
  return null
})

module.exports = morgan(
  ':remote-addr :method :url :status - :response-time ms - request: :reqBody - response: :resBody - length: :res[content-length] - authorization: :authorization',
  {stream, skip},
)
