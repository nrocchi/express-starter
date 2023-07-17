const jwt = require('express-jwt')
const format = require('../helpers/format')
const userService = require('../../features/users/users.service')
const roleService = require('../../features/roles/roles.service')
const statusService = require('../../features/statuses/statuses.service')

module.exports = (roles = null) => {
  const secret = process.env.JWT_SECRET

  return [
    // Handle express-jwt token
    // Handle express-jwt errors automatically with the next errors middleware
    jwt({secret, algorithms: ['HS256']}),

    // Auth middleware
    async (req, res, next) => {
      // Handle user with user id from the token
      const user = await userService.getUser('id', req.user.sub)

      if (!user) {
        const error = {
          code: 400,
          message: 'The user was not found.',
        }
        next(error)
      }

      // Handle status
      const status = await statusService.getStatus('id', user.status.id)

      if (!status) {
        const error = {
          code: 400,
          message: 'The status was not found.',
        }
        next(error)
      }

      if (user.status.code !== 'ACTIVE') {
        const error = {
          code: 403,
          message: `Your account is ${user.status.name}.`,
        }
        next(error)
      }

      // Handle role
      const role = await roleService.getRole('id', user.role.id)

      if (!role) {
        const error = {
          code: 400,
          message: 'The role was not found.',
        }
        next(error)
      }

      // Handle auth with the user role and the roles param (string or array)
      let authRole
      if (roles) {
        if (typeof roles === 'string') {
          authRole = format.getUnderscore(roles).toUpperCase()
        } else {
          authRole = roles.find(
            (r) => format.getUnderscore(r).toUpperCase() === user.role.code,
          )
        }

        if (
          !authRole ||
          format.getUnderscore(authRole).toUpperCase() !== user.role.code
        ) {
          const error = {
            code: 403,
            message: `You must be ${
              typeof roles === 'string'
                ? `${format.getUnderscore(roles).toUpperCase()}.`
                : `${format
                    .getUnderscore(roles.join(' or '))
                    .toUpperCase()
                    .replace(/_OR_/g, ' or ')} to access this page.`
            }`,
          }
          next(error)
        }
      }

      // Auth success : add user to the request
      req.user = user
      next()
      return false
    },
  ]
}
