const express = require('express')
const apicache = require('apicache-plus')

const config = require('../../app/config/config')
const auth = require('../../app/middlewares/auth')
const roleController = require('./roles.controller')

const router = express.Router()
const cache = apicache.middleware

router.get(
  '/',
  auth(['super admin', 'admin']),
  cache(config.cacheTime),
  roleController.getRoles,
)
router.get(
  '/:id',
  auth(['super admin', 'admin']),
  cache(config.cacheTime),
  roleController.getRole,
)

module.exports = router
