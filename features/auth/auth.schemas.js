const joi = require('joi')
const config = require('../../app/config/config')
const validate = require('../../app/middlewares/validate')

exports.signIn = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email({minDomainSegments: 2}).required(),
    password: joi
      .string()
      .pattern(config.regexPassword, {
        name: 'password',
      })
      .message(
        'Your password must contain at least 1 lowercase, 1 uppercase alphabetical character, 1 numeric character and 8 characters or longer.',
      )
      .required(),
  })
  validate(req, res, next, schema)
}

exports.signUp = (req, res, next) => {
  const schema = joi.object({
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

exports.createPassword = (req, res, next) => {
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
    passwordConfirm: joi
      .string()
      .empty('')
      .valid(joi.ref('password'))
      .messages({'any.only': 'Passwords must match.'})
      .required(),
    token: joi.string().empty().required(),
  })
  validate(req, res, next, schema)
}

exports.forgotPassword = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email({minDomainSegments: 2}).required(),
  })
  validate(req, res, next, schema)
}

exports.resetPassword = (req, res, next) => {
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
    passwordConfirm: joi
      .string()
      .empty('')
      .valid(joi.ref('password'))
      .messages({'any.only': 'Passwords must match.'})
      .required(),
    token: joi.string().empty().required(),
  })
  validate(req, res, next, schema)
}

exports.refresh = (req, res, next) => {
  const schema = joi.object({
    refresh: joi.string().allow(null).required(),
  })
  validate(req, res, next, schema)
}
