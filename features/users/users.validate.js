const bcrypt = require('bcryptjs')
const userService = require('./users.service')

module.exports = async (req, next) => {
  try {
    const id = req.params.id || null
    const email = req.body.email || null
    const password = req.body.password || null
    const role = req.body.role_id || 0
    const currentUser = req.user

    const user = await userService.getUser('id', id)
    const userWithPassword = await userService.getUserWithPassword('id', id)
    const existingUser = await userService.getUser('email', email)

    // GET, PUT, DELETE METHODS => id
    // Cannot get or update or delete a non existing user => !user
    if (id && !user) {
      const error = {
        code: 400,
        message: 'The user was not found.',
      }
      next(error)
      return false
    }

    // GET, PUT, DELETE METHODS => user
    //   Cannot get or update or delete a user with current role above the current user role
    //   => user.role.priority < currentUser.role.priority
    //   OR
    //   Cannot update a user with a new role above the current user role
    //   => role > 0 && role < currentUser.role.priority
    // OR
    // POST METHOD => !user
    //   Cannot create a user with a new role above the current user role
    //   => role > 0 && role < currentUser.role.priority
    if (
      (user &&
        currentUser &&
        (user.role.priority < currentUser.role.priority ||
          (role > 0 && role < currentUser.role.priority))) ||
      (!user && currentUser && role > 0 && role < currentUser.role.priority)
    ) {
      const error = {
        code: 403,
        message: 'You cannot access this resource.',
      }
      next(error)
      return false
    }

    // PUT METHOD => user
    //   Cannot update with another existing user email
    //   => existingUser
    //   But can update himself
    //   => parseInt(req.params.id, 10) !== existingUser.id
    // OR
    // POST METHOD => !user
    //   Cannot create with another existing user email
    //   => existingUser
    if (
      (user &&
        existingUser &&
        parseInt(req.params.id, 10) !== existingUser.id) ||
      (!user && existingUser)
    ) {
      const error = {
        code: 400,
        message: `The ${email} user already exists.`,
      }
      next(error)
      return false
    }

    // PUT METHOD
    // Cannot update password if new password does not match confirm password
    // And if current password does not match with the user password
    if (
      id &&
      password &&
      !(await bcrypt.compare(password, userWithPassword.password))
    ) {
      const error = {
        code: 400,
        message: 'The current password is invalid',
      }
      next(error)
      return false
    }

    return user || true
  } catch (error) {
    next(error)
    return false
  }
}
