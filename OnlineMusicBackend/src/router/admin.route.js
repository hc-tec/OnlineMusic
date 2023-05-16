const Router = require('koa-router')

const { auth } = require('../middleware/user.middleware')
const { hasAdminPermission, verifySinger, verifySong, verifyChangeSong } = require('../middleware/admin.middleware')
const { addSinger, changeSinger, addSong, changeSong, getAllUsers, resetPassword, deleteUser, deleteSong, deleteSinger, adminDeleteComment, getAllComments } = require('../controller/admin.controller')


const router = new Router()

router.post('/addSinger', auth, hasAdminPermission, verifySinger, addSinger)

router.post('/changeSinger', auth, hasAdminPermission, verifySinger, changeSinger)

router.post('/deleteSinger', auth, hasAdminPermission, deleteSinger)

router.post('/addSong', auth, hasAdminPermission, verifySong, addSong)

router.post('/changeSong', auth, hasAdminPermission, verifyChangeSong, changeSong)

router.post('/deleteSong', auth, hasAdminPermission, deleteSong)

router.get('/getAllUsers', auth, hasAdminPermission, getAllUsers)

router.post('/resetPassword', auth, hasAdminPermission, resetPassword)

router.post('/deleteUser', auth, hasAdminPermission, deleteUser)

router.post('/adminDeleteComment', auth, hasAdminPermission, adminDeleteComment)

router.get('/getAllComments', auth, hasAdminPermission, getAllComments)

module.exports = router

