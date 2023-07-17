module.exports = async (req, _res, next, schema, type = 'body') => {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  }

  try {
    const value = await schema.validateAsync(req[type], options)
    req[type] = value
    next()
  } catch (err) {
    const error = {
      code: 400,
      message: err.details.map((e) => e.message),
    }
    next(error)
  }
}
