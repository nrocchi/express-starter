const statusService = require('./statuses.service')

module.exports = async (req, next) => {
  try {
    const id = req.params.id || null

    const status = await statusService.getStatus('id', id)

    // Cannot get a non existing status => !status
    if (!status) {
      const error = {
        code: 400,
        message: 'The status was not found.',
      }
      next(error)
      return false
    }

    return status
  } catch (error) {
    next(error)
    return false
  }
}
