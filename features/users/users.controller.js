const jwt = require('jsonwebtoken')
const apicache = require('apicache-plus')

const userService = require('./users.service')
const userValidate = require('./users.validate')
const userStats = require('./users.stats')
const config = require('../../app/config/config')
const email = require('../../app/helpers/email')
const periodHelper = require('../../app/helpers/period')

exports.getUsers = async (req, res, next) => {
  try {
    const results = await userService.getUsers(req)

    req.apicacheGroup = 'users'

    return res.json({
      status: 'success',
      message: 'The users has been retrieved!',
      datas: results.items,
      total: results.total,
      pagination: results.pagination,
    })
  } catch (error) {
    next(error)
    return false
  }
}

exports.getUsersByPeriod = async (req, res, next) => {
  try {
    const period = req.query.period || 'TODAY'

    const periods = await periodHelper.getPeriod(period)

    const results = await userService.getUsersByPeriod(periods)

    const datas = await userStats.getStats(
      results.current.rows,
      results.previous.rows,
      results.current.count,
      results.previous.count,
      periods,
    )

    req.apicacheGroup = `users/period/${req.body.period}`

    return res.json({
      status: 'success',
      message: 'The users by period have been retrieved!',
      datas,
    })
  } catch (error) {
    next(error)
    return false
  }
}

exports.getUser = async (req, res, next) => {
  const user = await userValidate(req, next)

  if (user) {
    req.apicacheGroup = `users/${req.params.id}`

    return res.json({
      status: 'success',
      message: 'The user has been retrieved!',
      datas: user,
    })
  }
  return false
}

exports.createUser = async (req, res, next) => {
  const valid = await userValidate(req, next)

  if (valid) {
    try {
      const user = await userService.createUser(req.body)

      if (user === 1) {
        const restoredUser = await userService.getUser('email', req.body.email)

        if (restoredUser) {
          apicache.clear('users')

          return res.json({
            status: 'success',
            message: `The user ${req.body.email} has been restored!`,
            datas: restoredUser,
          })
        }

        const error = {
          code: 400,
          message: 'The user was not found.',
        }
        next(error)
        return false
      }

      if (user) {
        await email.sendWelcomeEmail(user)

        apicache.clear('users')

        return res.json({
          status: 'success',
          message: `The user ${req.body.email} has been created!`,
          datas: user,
        })
      }

      const error = {
        code: 400,
        message: 'The user has not been created.',
      }
      next(error)
      return false
    } catch (error) {
      next(error)
      return false
    }
  }
  return false
}

exports.inviteUser = async (req, res, next) => {
  const valid = await userValidate(req, next)

  if (valid) {
    try {
      const user = await userService.createUser(req.body)

      if (user === 1) {
        const restoredUser = await userService.getUser('email', req.body.email)

        if (restoredUser) {
          apicache.clear('users')

          return res.json({
            status: 'success',
            message: `The user ${req.body.email} has been restored!`,
            datas: restoredUser,
          })
        }

        const error = {
          code: 400,
          message: 'The user was not found.',
        }
        next(error)
        return false
      }

      if (user) {
        const token = jwt.sign({sub: user.id}, process.env.JWT_SECRET, {
          expiresIn: config.jwt_expires_reset,
        })

        const [result] = await userService.updateUser(user.id, {
          invitation_token: token,
        })

        if (result === 1) {
          await email.sendInvitationEmail(user, token)

          apicache.clear('users')

          return res.json({
            status: 'success',
            message: `The user ${req.body.email} has been invited!`,
            datas: user,
          })
        }
      }

      const error = {
        code: 400,
        message: 'The user has not been invited.',
      }
      next(error)
      return false
    } catch (error) {
      next(error)
      return false
    }
  }
  return false
}

exports.updateUser = async (req, res, next) => {
  const user = await userValidate(req, next)

  if (user) {
    try {
      const [result] = await userService.updateUser(req.params.id, req.body)

      if (result === 1) {
        const updatedUser = await userService.getUser('id', req.params.id)

        if (updatedUser) {
          apicache.clear('users')
          apicache.clear(`users/${req.params.id}`)

          return res.json({
            status: 'success',
            message: `The user ${updatedUser.email} has been edited!`,
            datas: updatedUser,
          })
        }

        const error = {
          code: 400,
          message: 'The user was not found.',
        }
        next(error)
        return false
      }

      const error = {
        code: 400,
        message: 'The user has not been edited.',
      }
      next(error)
      return false
    } catch (error) {
      next(error)
      return false
    }
  }
  return false
}

exports.updateUserPassword = async (req, res, next) => {
  const user = await userValidate(req, next)

  if (user) {
    try {
      const [result] = await userService.updateUserPassword(
        req.params.id,
        req.body,
      )

      if (result === 1) {
        const updatedUser = await userService.getUser('id', req.params.id)

        if (updatedUser) {
          apicache.clear('users')
          apicache.clear(`users/${req.params.id}`)

          return res.json({
            status: 'success',
            message: 'Your password has been edited!',
            datas: updatedUser,
          })
        }

        const error = {
          code: 400,
          message: 'The user was not found.',
        }
        next(error)
        return false
      }

      const error = {
        code: 400,
        message: 'The user has not been edited.',
      }
      next(error)
      return false
    } catch (error) {
      next(error)
      return false
    }
  }
  return false
}

exports.deleteUser = async (req, res, next) => {
  const user = await userValidate(req, next)

  if (user) {
    try {
      const result = await userService.deleteUser(req.params.id)

      if (result === 1) {
        apicache.clear('users')
        apicache.clear(`users/${req.params.id}`)

        return res.json({
          status: 'success',
          message: `The user ${user.email} has been deleted!`,
          datas: user,
        })
      }

      const error = {
        code: 400,
        message: 'The user has not been deleted.',
      }
      next(error)
      return false
    } catch (error) {
      next(error)
      return false
    }
  }
  return false
}
