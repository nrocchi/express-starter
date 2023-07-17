const roleService = require('./roles.service')

module.exports = async (req, next) => {
  try {
    const id = req.params.id || null
    const currentUser = req.user

    const role = await roleService.getRole('id', id)

    // Cannot get a non existing role => !role
    if (!role) {
      const error = {
        code: 400,
        message: 'The role was not found.',
      }
      next(error)
      return false
    }

    // Cannot get a role above the current user role
    // => role.priority < currentUser.role.priority
    if (currentUser && role.priority < currentUser.role.priority) {
      const error = {
        code: 403,
        message: 'You cannot access this resource.',
      }
      next(error)
      return false
    }

    return role
  } catch (error) {
    next(error)
    return false
  }
}
