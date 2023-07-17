const dotenv = require('dotenv')
const path = require('path')

module.exports = dotenv.config({
  path: path.resolve(`./.env.${process.env.NODE_ENV}`),
})
