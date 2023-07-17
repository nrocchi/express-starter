const express = require('express')
const apicache = require('apicache-plus')

const config = require('../../app/config/config')
const auth = require('../../app/middlewares/auth')
const statusController = require('./statuses.controller')

const router = express.Router()
const cache = apicache.middleware

router.get(
  '/',
  auth(['super admin', 'admin']),
  cache(config.cacheTime),
  statusController.getStatuses,
)
router.get(
  '/:id',
  auth(['super admin', 'admin']),
  cache(config.cacheTime),
  statusController.getStatus,
)

module.exports = router
