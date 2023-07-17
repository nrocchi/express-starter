const chalk = require('chalk')
const ora = require('ora')
const util = require('util')
const db = require('../helpers/db')

module.exports = async (error, _req, res, _next) => {
  let result
  let code
  let message

  // Sequelize errors
  if (error instanceof db.Sequelize.ValidationError) {
    const sequelizeErrors = []
    error.errors.map((e) => sequelizeErrors.push(e.message))
    code = 400
    message = sequelizeErrors
  } else {
    code = error.code
    message = error.message
  }

  if (error.name === 'UnauthorizedError') {
    // Express-jwt errors
    result = {
      code: error.status,
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : {},
    }
  } else {
    // Generic errors
    result = {
      code: code || 500,
      status: error.status || 'error',
      message: message || 'Something went wrong.',
      stack: process.env.NODE_ENV === 'development' ? error.stack : {},
    }
  }

  const spinner = ora().start()
  spinner.fail(
    chalk.red(
      `Error: ${util.inspect(result, {
        colors: true,
        depth: null,
      })}`,
    ),
  )
  res.status(result.code).json(result)
}
