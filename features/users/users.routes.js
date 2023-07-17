const express = require('express')
const apicache = require('apicache-plus')

const config = require('../../app/config/config')
const auth = require('../../app/middlewares/auth')
const userController = require('./users.controller')
const userSchema = require('./users.schema')

const router = express.Router()
const cache = apicache.middleware

router.get(
  '/',
  auth(['super admin', 'admin']),
  cache(config.cacheTime),
  userController.getUsers,
)
router.get(
  '/stats',
  auth(),
  cache(config.cacheTime),
  userSchema.period,
  userController.getUsersByPeriod,
)
router.get('/:id', auth(), cache(config.cacheTime), userController.getUser)
router.post(
  '/',
  auth(['super admin']),
  userSchema.create,
  userController.createUser,
)
router.post(
  '/invite',
  auth(['super admin', 'admin']),
  userSchema.invite,
  userController.inviteUser,
)
router.put('/:id', auth(), userSchema.update, userController.updateUser)
router.put(
  '/:id/password',
  auth(),
  userSchema.updatePassword,
  userController.updateUserPassword,
)
router.delete('/:id', auth(['super admin', 'admin']), userController.deleteUser)

module.exports = router
