const express = require('express')
const AuthController = require('./auth.controller')
const AuthSchemas = require('./auth.schemas')

const router = express.Router()

router.post('/signin', AuthSchemas.signIn, AuthController.signIn)
router.post('/signup', AuthSchemas.signUp, AuthController.signUp)
router.post('/refresh', AuthSchemas.refresh, AuthController.refresh)
router.post(
  '/forgot-password',
  AuthSchemas.forgotPassword,
  AuthController.forgotPassword,
)
router.post(
  '/reset-password',
  AuthSchemas.resetPassword,
  AuthController.resetPassword,
)
router.post(
  '/create-password',
  AuthSchemas.createPassword,
  AuthController.createPassword,
)

module.exports = router
