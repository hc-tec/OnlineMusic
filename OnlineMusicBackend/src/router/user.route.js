const Router = require('koa-router')

const { register } = require('../controller/user.controller')

const router = new Router()

router.post('/register', register)

module.exports = router

