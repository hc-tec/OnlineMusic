const Router = require('koa-router')

const { register, login, changePassword, changeAvatar, autoLogin } = require('../controller/user.controller')
const { userValidator, verifyUser, cryptPassword, verifyLogin, auth } = require('../middleware/user.middleware')

const router = new Router()

router.post('/register', userValidator, verifyUser, cryptPassword, register)

router.post('/login', userValidator, verifyLogin, login)

router.post('/changePassword', auth, userValidator, cryptPassword, changePassword)

router.post('/changeAvatar', auth, changeAvatar)

// 带上token的自动登录接口
router.post('/autoLogin', auth, autoLogin)

module.exports = router

