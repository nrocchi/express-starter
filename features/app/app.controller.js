exports.healthCheck = (_req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'Server is running',
    timestamp: Date.now(),
  }
  try {
    res.send(healthcheck)
  } catch (error) {
    healthcheck.message = error
    res.send(healthcheck)
  }
}

exports.notFound = (_req, _res, next) => {
  const error = {code: 404, message: 'Resource not found'}
  next(error)
}
