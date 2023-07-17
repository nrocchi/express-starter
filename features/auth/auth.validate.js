const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userService = require('../users/users.service')

exports.signIn = async (req, next) => {
  try {
    const email = req.body.email || null
    const password = req.body.password || null

    const user = await userService.getUser('email', email)
    const userWithPassword = await userService.getUserWithPassword(
      'email',
      email,
    )

    // Cannot signin if email or password is incorrect
    if (!user || !(await bcrypt.compare(password, userWithPassword.password))) {
      const error = {
        code: 400,
        message: 'Invalid credentials.',
      }
      next(error)
      return false
    }

    // Cannot signin if user status is not active
    if (user.status.id !== 1) {
      const message = user.status.id === 2 ? 'inactive' : 'pending'
      const error = {
        code: 400,
        message: `Your account is ${message}.`,
      }
      next(error)
      return false
    }

    return user
  } catch (error) {
    next(error)
    return false
  }
}

exports.signUp = async (req, next) => {
  try {
    const email = req.body.email || null

    const existingUser = await userService.getUser('email', email)

    // Cannot create with another existing user email
    if (existingUser) {
      const error = {
        code: 400,
        message: `The ${email} user already exists.`,
      }
      next(error)
      return false
    }

    return true
  } catch (error) {
    next(error)
    return false
  }
}

exports.createPassword = async (req, next) => {
  try {
    const token = req.body.token || null

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (errors) => {
        if (errors) {
          const error = {
            code: 400,
            message: 'Your invitation link is invalid or expired.',
          }
          next(error)
          return false
        }
        return false
      })

      const user = await userService.getUser('invitation_token', token)

      // Cannot create password if user does not exist
      if (!user) {
        const error = {
          code: 400,
          message: 'The user was not found.',
        }
        next(error)
        return false
      }

      // Cannot create password if user status is not pending
      if (user && user.status.id !== 3) {
        const error = {
          code: 400,
          message: `Your account is not pending.`,
        }
        next(error)
        return false
      }

      return user
    }

    return false
  } catch (error) {
    next(error)
    return false
  }
}

exports.forgotPassword = async (req, next) => {
  try {
    const email = req.body.email || null

    const user = await userService.getUser('email', email)

    // Cannot send forgot password email if user does not exist
    // if (!user) {
    //   const error = {
    //     code: 400,
    //     message: 'The user was not found.',
    //   }
    //   next(error)
    //   return false
    // }

    // Cannot send forgot password email if user status is not active
    if (user && user.status.id !== 1) {
      const message = user.status.id === 2 ? 'inactive' : 'pending'
      const error = {
        code: 400,
        message: `Your account is ${message}.`,
      }
      next(error)
      return false
    }

    return user
  } catch (error) {
    next(error)
    return false
  }
}

exports.resetPassword = async (req, next) => {
  try {
    const token = req.body.token || null

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (errors) => {
        if (errors) {
          const error = {
            code: 400,
            message: 'Your reset link is invalid or expired.',
          }
          next(error)
          return false
        }
        return false
      })

      const user = await userService.getUser('reset_token', token)

      // Cannot reset password if user does not exist
      if (!user) {
        const error = {
          code: 400,
          message: 'The user was not found.',
        }
        next(error)
        return false
      }

      // Cannot reset password if user status is not active
      if (user && user.status.id !== 1) {
        const message = user.status.id === 2 ? 'inactive' : 'pending'

        const error = {
          code: 400,
          message: `Your account is ${message}.`,
        }
        next(error)
        return false
      }

      return user
    }

    return false
  } catch (error) {
    next(error)
    return false
  }
}

exports.refresh = async (req, next) => {
  try {
    const token = req.body.refresh || null

    if (token) {
      const verifiedToken = jwt.verify(
        token,
        process.env.JWT_SECRET,
        async (errors, decoded) => {
          if (errors) {
            const error = {
              code: 403,
              message: 'The refresh token is invalid or expired.',
            }
            next(error)
            return false
          }
          return decoded
        },
      )

      return verifiedToken
    }

    return false
  } catch (error) {
    next(error)
    return false
  }
}
