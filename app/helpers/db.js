const {Sequelize} = require('sequelize')
const ora = require('ora')
const chalk = require('chalk')
// const mysql = require('mysql2/promise')
const config = require('../config/config')

const db = {}
const spinner = ora().start()

const initialize = async () => {
  // Create db if it not exists
  // const host = process.env.DB_HOST
  // const port = process.env.DB_PORT
  // const database = process.env.DB_NAME
  // const user = process.env.DB_USER
  // const password = process.env.DB_PASSWORD
  // const connection = await mysql.createConnection({host, port, user, password})
  // await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`)

  // Database connection
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: config.dialect,
      dialectOptions: config.dialectOptions,
      timezone: config.timezone,
      logging: process.env.NODE_ENV !== 'test' ? config.logging : false,
    },
  )

  // Init models
  db.Role = require('../../features/roles/roles.model')(sequelize, Sequelize)
  db.Status = require('../../features/statuses/statuses.model')(
    sequelize,
    Sequelize,
  )
  db.Company = require('../../features/companies/companies.model')(
    sequelize,
    Sequelize,
  )
  db.User = require('../../features/users/users.model')(sequelize, Sequelize)
  db.Period = require('../../features/periods/periods.model')(
    sequelize,
    Sequelize,
  )
  db.Notification = require('../../features/notifications/notifications.model')(
    sequelize,
    Sequelize,
  )
  db.NotificationUser =
    require('../../features/notifications/notifications_users.model')(
      sequelize,
      Sequelize,
    )

  // Associate models
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

  db.Sequelize = Sequelize
  db.sequelize = sequelize

  // Test database connection
  // try {
  //   await sequelize.authenticate()
  //   spinner.succeed(chalk.green('Database connection succeeded.'))
  // } catch (error) {
  //   spinner.fail(chalk.red('Database connection failed:', error))
  //   process.exit(0)
  // }

  // Database sync
  if (config.sync === 'force') {
    try {
      await sequelize.sync({force: true})
      spinner.succeed(chalk.green('Database force sync succeeded!'))
    } catch (error) {
      spinner.fail(chalk.red('Database force sync failed:', error))
      process.exit(0)
    }
  } else if (config.sync === 'alter') {
    try {
      await sequelize.sync({alter: true})
      spinner.succeed(chalk.green('Database alter sync succeeded!'))
    } catch (error) {
      spinner.fail(chalk.red('Database alter sync failed:', error))
      process.exit(0)
    }
  } else if (config.sync) {
    try {
      await sequelize.sync()
      spinner.succeed(chalk.green('Database sync succeeded!'))
    } catch (error) {
      spinner.fail(chalk.red('Database sync failed:', error))
      process.exit(0)
    }
  } else {
    spinner.succeed(chalk.green('Database no sync succeeded!'))
  }
}

initialize()

module.exports = db
