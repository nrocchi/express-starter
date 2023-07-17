const express = require('express')
const apicache = require('apicache-plus')

const router = express.Router()
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../../swagger-output.json')
const AppController = require('./app.controller')

const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Express.js Starter',
  customfavIcon: '/public/images/favicon.ico',
}

// App routes
router.get('/', AppController.healthCheck)
router.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile, options))
router.use('/auth', require('../auth/auth.routes'))
router.use('/roles', require('../roles/roles.routes'))
router.use('/statuses', require('../statuses/statuses.routes'))
router.use('/companies', require('../companies/companies.routes'))
router.use('/users', require('../users/users.routes'))
router.use('/notifications', require('../notifications/notifications.routes'))
router.use('/periods', require('../periods/periods.routes'))

router.use('/cache', (_req, res) => {
  res.json(apicache.getIndex())
})
router.use('/cache/clear', (_req, res) => {
  res.json(apicache.clear())
})

router.use('*', AppController.notFound)

module.exports = router
