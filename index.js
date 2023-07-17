require('rootpath')()
const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const apicache = require('apicache-plus')
const ora = require('ora')
const chalk = require('chalk')
const util = require('util')
const timeout = require('express-timeout-handler')

const app = express()
const http = require('http').createServer(app)
const env = require('./app/config/env')
const config = require('./app/config/config')
const router = require('./features/app/app.routes')
const body = require('./app/middlewares/body')
const log = require('./app/middlewares/log')
const errors = require('./app/middlewares/error')

let server

// Timeout
const timeoutOptions = {
  timeout: config.timeout,
  onTimeout(_req, _res, next) {
    const error = {
      code: 504,
      message: 'Service unavailable. Please retry later.',
    }
    next(error)
  },
}

if (process.env.NODE_ENV !== 'test') {
  // Cache debug
  apicache.options({debug: config.cacheDebug})

  // Logs
  if (config.logDebug) {
    app.use(log)
  }
}

// Middlewares
app
  .use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))
  .use('/static', express.static(path.join(__dirname, 'public')))
  .use('/uploads', express.static(path.join(__dirname, 'uploads')))
  .use(bodyParser.urlencoded({extended: false}))
  .use(bodyParser.json({extended: false}))
  .use(cors())
  .use(timeout.handler(timeoutOptions))
  .use(body)
  .use(router)
  .use(errors)

// Start server
if (process.env.NODE_ENV !== 'test') {
  // Environment variables
  const spinner = ora().start()

  spinner.info(
    chalk.blue(
      `Environment variables:${util.inspect(env.parsed, {
        colors: true,
        depth: null,
      })}`,
    ),
  )

  spinner.info(
    chalk.cyan(
      `Config variables:${util.inspect(config, {
        colors: true,
        depth: null,
      })}`,
    ),
  )

  
  // Start socket
  try {
    require('./app/helpers/socket')(http)
    spinner.succeed(chalk.green('Socket connection succeeded.'))
  } catch (error) {
    spinner.fail(chalk.red('Socket connection failed:', error))
  }
  
  // Start elastic
  // try {
  //   require('./app/helpers/elastic')
  //   spinner.succeed(chalk.green('Elastic connection succeeded.'))
  // } catch (error) {
  //   spinner.fail(chalk.red('Elastic connection failed:', error))
  // }

  // Start crons
  // try {
  //   const cron = require('./app/helpers/cron')
  //   spinner.succeed(chalk.green('Cron connection succeeded.'))
  //   cron.firstCron()
  // } catch (error) {
  //   spinner.fail(chalk.red('Cron connection failed:', error))
  // }

  // Environment server
  server = http
    .listen(process.env.SERVER_PORT, () => {
      spinner.succeed(
        chalk.green(
          `Server listening on http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
        ),
      )
    })
    .on('error', (error) => {
      spinner.fail(chalk.red(`Error launching server :${error.message}`))
      process.exit(0)
    })
} else {
  // Test server
  server = http.listen(process.env.SERVER_PORT, () => {})
}

module.exports = server
