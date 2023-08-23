const joi = require('joi')
const config = require('../../app/config/config')
const validate = require('../../app/middlewares/validate')

exports.create = (req, res, next) => {
  const schema = joi.object({
    avatar: joi.string().allow(null).empty(''),
    username: joi.string().empty('').min(2).max(255),
    firstname: joi.string().empty('').min(2).max(255).required(),
    lastname: joi.string().empty('').min(2).max(255).required(),
    email: joi.string().empty('').email({minDomainSegments: 2}).required(),
    job: joi.string().empty('').min(2).max(255),
    role_id: joi.number().empty('').min(1).max(3).required(),
    status_id: joi.number().empty('').min(1).max(3).required(),
    company_id: joi.number().empty('').min(1).required(),
    password: joi
      .string()
      .empty('')
      .pattern(config.regexPassword, {
        name: 'password',
      })
      .message(
        'Your password must contain at least 1 lowercase, 1 uppercase alphabetical character, 1 numeric character and 8 characters or longer.',
      )
      .required(),
    passwordConfirm: joi
      .string()
      .empty('')
      .valid(joi.ref('password'))
      .messages({'any.only': 'Passwords must match.'})
      .required(),
  })
  validate(req, res, next, schema)
}

exports.invite = (req, res, next) => {
  const schema = joi.object({
    avatar: joi.string().allow(null).empty(''),
    username: joi.string().empty('').min(2).max(255),
    firstname: joi.string().empty('').min(2).max(255).required(),
    lastname: joi.string().empty('').min(2).max(255).required(),
    email: joi.string().empty('').email({minDomainSegments: 2}).required(),
    job: joi.string().empty('').min(2).max(255),
    role_id: joi.number().empty('').min(1).max(3).required(),
    status_id: joi.number().empty('').min(1).max(3).required(),
    company_id: joi.number().empty('').min(1).required(),
  })
  validate(req, res, next, schema)
}

exports.update = (req, res, next) => {
  const schema = joi.object({
    avatar: joi.string().allow(null).empty(''),
    username: joi.string().allow(null).empty('').min(2).max(255),
    firstname: joi.string().empty('').min(2).max(255).required(),
    lastname: joi.string().empty('').min(2).max(255).required(),
    email: joi.string().empty('').email({minDomainSegments: 2}).required(),
    job: joi.string().allow(null).empty('').min(2).max(255),
    role_id: joi.number().empty('').min(1).max(3).required(),
    status_id: joi.number().empty('').min(1).max(3).required(),
    company_id: joi.number().empty('').min(1),
    password: joi
      .string()
      .empty('')
      .pattern(config.regexPassword, {
        name: 'password',
      })
      .message(
        'Your password must contain at least 1 lowercase, 1 uppercase alphabetical character, 1 numeric character and 8 characters or longer.',
      ),
    passwordConfirm: joi
      .string()
      .empty('')
      .valid(joi.ref('password'))
      .messages({'any.only': 'Passwords must match.'}),
  })
  validate(req, res, next, schema)
}

exports.updatePassword = (req, res, next) => {
  const schema = joi.object({
    password: joi
      .string()
      .empty('')
      .pattern(config.regexPassword, {
        name: 'password',
      })
      .message(
        'Your password must contain at least 1 lowercase, 1 uppercase alphabetical character, 1 numeric character and 8 characters or longer.',
      )
      .required(),
    newPassword: joi
      .string()
      .empty('')
      .pattern(config.regexPassword, {
        name: 'password',
      })
      .message(
        'Your password must contain at least 1 lowercase, 1 uppercase alphabetical character, 1 numeric character and 8 characters or longer.',
      )
      .required(),
    passwordConfirm: joi
      .string()
      .empty('')
      .valid(joi.ref('newPassword'))
      .messages({'any.only': 'Passwords must match.'})
      .required(),
  })
  validate(req, res, next, schema)
}

exports.period = (req, res, next) => {
  const schema = joi.object({
    period: joi
      .string()
      .valid(
        'TODAY',
        'YESTERDAY',
        'THISWEEK',
        'THISMONTH',
        'THISQUARTER',
        'THISYEAR',
        'LASTWEEK',
        'LASTMONTH',
        'LASTQUARTER',
        'LASTYEAR',
        'LAST2YEARS',
        'LAST5YEARS',
      )
      .required(),
  })
  validate(req, res, next, schema, 'query')
}
