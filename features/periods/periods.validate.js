const periodService = require('./periods.service')

module.exports = async (req, next) => {
  try {
    const id = req.params.id || null

    const period = await periodService.getPeriod('id', id)

    // Cannot get a non existing period => !period
    if (!period) {
      const error = {
        code: 400,
        message: 'The period was not found.',
      }
      next(error)
      return false
    }

    return period
  } catch (error) {
    next(error)
    return false
  }
}
