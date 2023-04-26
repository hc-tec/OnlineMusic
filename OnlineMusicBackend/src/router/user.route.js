const Router = require('koa-router')

const { register, login, changePassword, changeAvatar } = require('../controller/user.controller')
const { userValidator, verifyUser, cryptPassword, verifyLogin, auth } = require('../middleware/user.middleware')

const router = new Router()

router.post('/register', userValidator, verifyUser, cryptPassword, register)

router.post('/login', userValidator, verifyLogin, login)

router.post('/changePassword', auth, cryptPassword, changePassword)

router.post('/changeAvatar', auth, changeAvatar)

module.exports = router

