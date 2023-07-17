const joi = require('joi')
const validate = require('../../app/middlewares/validate')

module.exports = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().empty('').min(2).max(255).required(),
    address: joi.string().empty('').min(2).max(255),
    zipcode: joi.string().empty('').min(2).max(255),
    city: joi.string().empty('').min(2).max(255),
    country: joi.string().empty('').min(2).max(255),
    countryCode: joi.string().empty('').min(2).max(255),
    latitude: joi.number().empty('').min(2).max(255),
    longitude: joi.number().empty('').min(2).max(255),
  })
  validate(req, res, next, schema)
}
