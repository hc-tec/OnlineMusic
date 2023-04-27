const Router = require('koa-router')

const { auth } = require('../middleware/user.middleware')
const { hasAdminPermission, verifySong, verifyChangeSong } = require('../middleware/admin.middleware')
const { addSinger, addSong, changeSong } = require('../controller/admin.controller')


const router = new Router()

router.post('/addSinger', auth, hasAdminPermission, addSinger)

router.post('/addSong', auth, hasAdminPermission, verifySong, addSong)

router.post('/changeSong', auth, hasAdminPermission, verifyChangeSong, changeSong)

module.exports = router

