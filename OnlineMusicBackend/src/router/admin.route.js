const Router = require('koa-router')

const { auth } = require('../middleware/user.middleware')
const { hasAdminPermission, verifySinger, verifySong, verifyChangeSong } = require('../middleware/admin.middleware')
const { addSinger, changeSinger, addSong, changeSong, getAllUsers, resetPassword, deleteUser } = require('../controller/admin.controller')


const router = new Router()

router.post('/addSinger', auth, hasAdminPermission, verifySinger, addSinger)

router.post('/changeSinger', auth, hasAdminPermission, verifySinger, changeSinger)

router.post('/addSong', auth, hasAdminPermission, verifySong, addSong)

router.post('/changeSong', auth, hasAdminPermission, verifyChangeSong, changeSong)

router.get('/getAllUsers', auth, hasAdminPermission, getAllUsers)

router.post('/resetPassword', auth, hasAdminPermission, resetPassword)

router.post('/deleteUser', auth, hasAdminPermission, deleteUser)


module.exports = router

