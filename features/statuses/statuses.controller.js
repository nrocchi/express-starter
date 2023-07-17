const statusService = require('./statuses.service')
const statusValidate = require('./statuses.validate')

exports.getStatuses = async (req, res, next) => {
  try {
    const results = await statusService.getStatuses(req)

    return res.json({
      status: 'success',
      message: 'The statuses has been retrieved!',
      datas: results.items,
      total: results.total,
      pagination: results.pagination,
    })
  } catch (error) {
    next(error)
    return false
  }
}

exports.getStatus = async (req, res, next) => {
  const status = await statusValidate(req, next)

  if (status) {
    return res.json({
      status: 'success',
      message: 'The status has been retrieved!',
      datas: status,
    })
  }
  return false
}
