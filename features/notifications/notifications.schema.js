const joi = require('joi')
const validate = require('../../app/middlewares/validate')

exports.create = (req, res, next) => {
  const schema = joi.object({
    category: joi.string().empty('').min(2).max(255).required(),
    content: joi.string().empty('').min(2).max(255).required(),
    type: joi.string().empty('').min(2).max(255).required(),
    sender: joi.object({
      id: joi.number().required(),
      avatar: joi.string().allow(null).empty(''),
      email: joi.string().empty('').email({minDomainSegments: 2}).required(),
      username: joi.string().allow(null).empty('').min(2).max(255),
      firstname: joi.string().empty('').min(2).max(255).required(),
      lastname: joi.string().empty('').min(2).max(255).required(),
      job: joi.string().allow(null).empty('').min(2).max(255),
      created_at: joi.string().empty('').min(2).max(255).required(),
      updated_at: joi.string().empty('').min(2).max(255).required(),
      role: joi.object({
        id: joi.number().required(),
        code: joi.string().empty('').min(2).max(255).required(),
        name: joi.string().empty('').min(2).max(255).required(),
        priority: joi.number().required(),
        created_at: joi.string().empty('').min(2).max(255).required(),
        updated_at: joi.string().empty('').min(2).max(255).required(),
      }),
      status: joi.object({
        id: joi.number().required(),
        code: joi.string().empty('').min(2).max(255).required(),
        name: joi.string().empty('').min(2).max(255).required(),
        created_at: joi.string().empty('').min(2).max(255).required(),
        updated_at: joi.string().empty('').min(2).max(255).required(),
      }),
      company: joi.object({
        id: joi.number().required(),
        name: joi.string().empty('').min(2).max(255).required(),
        address: joi.string().empty('').min(2).max(255),
        zipcode: joi.string().empty('').min(2).max(255),
        city: joi.string().empty('').min(2).max(255),
        country: joi.string().empty('').min(2).max(255),
        countryCode: joi.string().empty('').min(2).max(255),
        latitude: joi.number().empty(''),
        longitude: joi.number().empty(''),
        created_at: joi.string().empty('').min(2).max(255).required(),
        updated_at: joi.string().empty('').min(2).max(255).required(),
      }),
    }),
    target: joi.object({
      id: joi.number().required(),
      avatar: joi.string().allow(null).empty(''),
      email: joi.string().empty('').email({minDomainSegments: 2}).required(),
      username: joi.string().allow(null).empty('').min(2).max(255),
      firstname: joi.string().empty('').min(2).max(255).required(),
      lastname: joi.string().empty('').min(2).max(255).required(),
      job: joi.string().allow(null).empty('').min(2).max(255),
      created_at: joi.string().empty('').min(2).max(255).required(),
      updated_at: joi.string().empty('').min(2).max(255).required(),
      role: joi.object({
        id: joi.number().required(),
        code: joi.string().empty('').min(2).max(255).required(),
        name: joi.string().empty('').min(2).max(255).required(),
        priority: joi.number().required(),
        created_at: joi.string().empty('').min(2).max(255).required(),
        updated_at: joi.string().empty('').min(2).max(255).required(),
      }),
      status: joi.object({
        id: joi.number().required(),
        code: joi.string().empty('').min(2).max(255).required(),
        name: joi.string().empty('').min(2).max(255).required(),
        created_at: joi.string().empty('').min(2).max(255).required(),
        updated_at: joi.string().empty('').min(2).max(255).required(),
      }),
      company: joi.object({
        id: joi.number().required(),
        name: joi.string().empty('').min(2).max(255).required(),
        address: joi.string().empty('').min(2).max(255),
        zipcode: joi.string().empty('').min(2).max(255),
        city: joi.string().empty('').min(2).max(255),
        country: joi.string().empty('').min(2).max(255),
        countryCode: joi.string().empty('').min(2).max(255),
        latitude: joi.number().empty(''),
        longitude: joi.number().empty(''),
        created_at: joi.string().empty('').min(2).max(255).required(),
        updated_at: joi.string().empty('').min(2).max(255).required(),
      }),
    }),
  })
  validate(req, res, next, schema)
}

exports.update = (req, res, next) => {
  const schema = joi.object({
    read: joi.number().required(),
  })
  validate(req, res, next, schema)
}
