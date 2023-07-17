const jwt = require('jsonwebtoken')
const apicache = require('apicache-plus')

const config = require('../../app/config/config')
const authValidate = require('./auth.validate')
const email = require('../../app/helpers/email')
const userService = require('../users/users.service')

exports.signIn = async (req, res, next) => {
  try {
    const user = await authValidate.signIn(req, next)

    if (user) {
      const token = jwt.sign({sub: user.id, user}, process.env.JWT_SECRET, {
        expiresIn: config.jwt_expires_auth,
      })
      const refreshToken = jwt.sign(
        {sub: user.id, user},
        process.env.JWT_SECRET,
        {
          expiresIn: config.jwt_expires_refresh,
        },
      )

      return res.json({
        status: 'success',
        message: `You are connected!`,
        user,
        token,
        refresh: refreshToken,
      })
    }

    return false
  } catch (error) {
    next(error)
    return false
  }
}

exports.signUp = async (req, res, next) => {
  try {
    const valid = await authValidate.signUp(req, next)

    if (valid) {
      try {
        const user = await userService.createUser(req.body)

        if (user) {
          const token = jwt.sign({sub: user.id, user}, process.env.JWT_SECRET, {
            expiresIn: config.jwt_expires_auth,
          })
          const refreshToken = jwt.sign(
            {sub: user.id, user},
            process.env.JWT_SECRET,
            {
              expiresIn: config.jwt_expires_refresh,
            },
          )

          await email.sendWelcomeEmail(user)

          return res.json({
            status: 'success',
            message: `Your account has been created!`,
            user,
            token,
            refresh: refreshToken,
          })
        }

        const error = {
          code: 400,
          message: 'Your account has not been created.',
        }
        next(error)
        return false
      } catch (error) {
        next(error)
        return false
      }
    }

    return false
  } catch (error) {
    next(error)
    return false
  }
}

exports.createPassword = async (req, res, next) => {
  try {
    const user = await authValidate.createPassword(req, next)

    if (user) {
      try {
        const [result] = await userService.createUserPassword(user.id, req.body)

        if (result === 1) {
          apicache.clear('users')
          apicache.clear(`users/${user.id}`)

          return res.json({
            status: 'success',
            message: 'Your password has been created!',
            user,
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
  } catch (error) {
    next(error)
    return false
  }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await authValidate.forgotPassword(req, next)

    if (user) {
      const token = jwt.sign({sub: user.id}, process.env.JWT_SECRET, {
        expiresIn: config.jwt_expires_reset,
      })

      const [result] = await userService.updateUser(user.id, {
        reset_token: token,
      })

      if (result === 1) {
        await email.sendForgotPasswordEmail(user, token)
      }
    }

    return res.json({
      status: 'success',
      message: `If an active user exists with this email, you will receive an email with the password reset link.`,
    })
  } catch (error) {
    next(error)
    return false
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const user = await authValidate.resetPassword(req, next)

    if (user) {
      try {
        const [result] = await userService.resetUserPassword(user.id, req.body)

        if (result === 1) {
          apicache.clear('users')
          apicache.clear(`users/${user.id}`)

          return res.json({
            status: 'success',
            message: 'Your password has been edited!',
            user,
          })
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
  } catch (error) {
    next(error)
    return false
  }
}

exports.refresh = async (req, res, next) => {
  try {
    const decodedToken = await authValidate.refresh(req, next)

    if (decodedToken) {
      const token = jwt.sign(
        {sub: decodedToken.user.id, user: decodedToken.user},
        process.env.JWT_SECRET,
        {
          expiresIn: config.jwt_expires_auth,
        },
      )
      const refreshToken = jwt.sign(
        {sub: decodedToken.user.id, user: decodedToken.user},
        process.env.JWT_SECRET,
        {
          expiresIn: config.jwt_expires_refresh,
        },
      )

      return res.json({
        status: 'success',
        message: `You are reconnected!`,
        user: decodedToken.user,
        token,
        refresh: refreshToken,
      })
    }

    const error = {
      code: 400,
      message: 'The refresh token is invalid or expired.',
    }
    next(error)
    return false
  } catch (error) {
    next(error)
    return false
  }
}
