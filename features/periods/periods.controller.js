const periodService = require('./periods.service')
const periodValidate = require('./periods.validate')

exports.getPeriods = async (req, res, next) => {
  try {
    const results = await periodService.getPeriods(req)

    return res.json({
      status: 'success',
      message: 'The periods has been retrieved!',
      datas: results.items,
      total: results.total,
      pagination: results.pagination,
    })
  } catch (error) {
    next(error)
    return false
  }
}

exports.getPeriod = async (req, res, next) => {
  const period = await periodValidate(req, next)

  if (period) {
    return res.json({
      status: 'success',
      message: 'The period has been retrieved!',
      datas: period,
    })
  }
  return false
}
