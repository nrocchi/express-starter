const express = require('express')
const apicache = require('apicache-plus')

const config = require('../../app/config/config')
const auth = require('../../app/middlewares/auth')
const companyController = require('./companies.controller')
const companySchema = require('./companies.schema')

const router = express.Router()
const cache = apicache.middleware

router.get(
  '/',
  auth(['super admin']),
  cache(config.cacheTime),
  companyController.getCompanies,
)
router.get(
  '/:id',
  auth(['super admin']),
  cache(config.cacheTime),
  companyController.getCompany,
)
router.post(
  '/',
  auth(['super admin']),
  companySchema,
  companyController.createCompany,
)
router.put(
  '/:id',
  auth(['super admin']),
  companySchema,
  companyController.updateCompany,
)
router.delete('/:id', auth(['super admin']), companyController.deleteCompany)

module.exports = router
