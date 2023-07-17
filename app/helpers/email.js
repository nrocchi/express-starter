const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const ora = require('ora')
const chalk = require('chalk')
const util = require('util')
const file = require('./file')
const config = require('../config/config')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

exports.sendWelcomeEmail = async (contact) => {
  const html = await file.readHTML('/app/templates/email/welcome.html')

  const template = handlebars.compile(html)

  const replacements = {
    avatar: contact.avatar,
    email: contact.email,
    username: contact.username,
    firstname: contact.firstname,
    lastname: contact.lastname,
    serverHost: process.env.SERVER_HOST,
    serverPort: process.env.SERVER_PORT,
    title: config.title,
    website: process.env.WEBSITE_URL,
  }

  const htmlToSend = template(replacements)

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: contact.email,
    subject: `Welcome to the ${config.title} platform`,
    html: htmlToSend,
  }

  return new Promise((resolve, reject) => {
    const spinner = ora().start()

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        spinner.fail(chalk.red('Sending email failed:', err))
        const error = {
          code: 400,
          message: 'The welcome email has not been sent.',
          stack: err,
        }
        reject(error)
      } else {
        spinner.succeed(
          chalk.green(
            `Sending email succeeded: ${util.inspect(info, {
              colors: true,
              depth: null,
            })}`,
          ),
        )
        resolve(true)
      }
    })
  })
}

exports.sendInvitationEmail = async (contact, token) => {
  const html = await file.readHTML('/app/templates/email/invitation.html')

  const template = handlebars.compile(html)

  const replacements = {
    avatar: contact.avatar,
    email: contact.email,
    firstname: contact.firstname,
    lastname: contact.lastname,
    serverHost: process.env.SERVER_HOST,
    serverPort: process.env.SERVER_PORT,
    title: config.title,
    website: process.env.WEBSITE_URL,
    token,
  }

  const htmlToSend = template(replacements)

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: contact.email,
    subject: `Invitation for the ${config.title} platform`,
    html: htmlToSend,
  }

  return new Promise((resolve, reject) => {
    const spinner = ora().start()

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        spinner.fail(chalk.red('Sending email failed:', err))
        const error = {
          code: 400,
          message: 'The invitation email has not been sent.',
          stack: err,
        }
        reject(error)
      } else {
        spinner.succeed(
          chalk.green(
            `Sending email succeeded: ${util.inspect(info, {
              colors: true,
              depth: null,
            })}`,
          ),
        )
        resolve(true)
      }
    })
  })
}

exports.sendForgotPasswordEmail = async (contact, token) => {
  const html = await file.readHTML('/app/templates/email/forgot-password.html')

  const template = handlebars.compile(html)

  const replacements = {
    email: contact.email,
    firstname: contact.firstname,
    serverHost: process.env.SERVER_HOST,
    serverPort: process.env.SERVER_PORT,
    title: config.title,
    website: process.env.WEBSITE_URL,
    token,
  }

  const htmlToSend = template(replacements)

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: contact.email,
    subject: `Recover your password for the ${config.title} platform`,
    html: htmlToSend,
  }

  return new Promise((resolve, reject) => {
    const spinner = ora().start()

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        spinner.fail(chalk.red('Sending email failed:', err))
        const error = {
          code: 400,
          message: 'The recovery password email has not been sent.',
          stack: err,
        }
        reject(error)
      } else {
        spinner.succeed(
          chalk.green(
            `Sending email succeeded: ${util.inspect(info, {
              colors: true,
              depth: null,
            })}`,
          ),
        )
        resolve(true)
      }
    })
  })
}
