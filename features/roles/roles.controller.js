const roleService = require('./roles.service')
const roleValidate = require('./roles.validate')

exports.getRoles = async (req, res, next) => {
  try {
    const results = await roleService.getRoles(req)

    return res.json({
      status: 'success',
      message: 'The roles has been retrieved!',
      datas: results.items,
      total: results.total,
      pagination: results.pagination,
    })
  } catch (error) {
    next(error)
    return false
  }
}

exports.getRole = async (req, res, next) => {
  const role = await roleValidate(req, next)

  if (role) {
    return res.json({
      status: 'success',
      message: 'The role has been retrieved!',
      datas: role,
    })
  }
  return false
}
