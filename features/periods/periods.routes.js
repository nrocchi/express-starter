const express = require('express')
const apicache = require('apicache-plus')

const config = require('../../app/config/config')
const auth = require('../../app/middlewares/auth')
const periodController = require('./periods.controller')

const router = express.Router()
const cache = apicache.middleware

router.get('/', auth(), cache(config.cacheTime), periodController.getPeriods)
router.get('/:id', auth(), cache(config.cacheTime), periodController.getPeriod)

module.exports = router
