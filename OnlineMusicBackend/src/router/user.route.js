const Router = require('koa-router')

const { register, login, changePassword, changeAvatar, autoLogin, addLoveSong, deleteLoveSong, listenSong, addComment, deleteComment, getUserAvatar, getAllSingers, getAllSongsSimpleInfo, getSongLyric, getComment, handleFavour, getAllSongKus } = require('../controller/user.controller')
const { userValidator, verifyUser, cryptPassword, verifyLogin, auth, verifySongIdExist } = require('../middleware/user.middleware')

const router = new Router()

router.post('/register', userValidator, verifyUser, cryptPassword, register)

router.post('/login', userValidator, verifyLogin, login)

router.post('/changePassword', auth, userValidator, cryptPassword, changePassword)

router.post('/changeAvatar', auth, changeAvatar)

// 带上token的自动登录接口
router.post('/autoLogin', auth, autoLogin)

router.post('/addLoveSong', auth, verifySongIdExist, addLoveSong)

router.post('/deleteLoveSong', auth, verifySongIdExist, deleteLoveSong)

// 点击歌曲后发送请求，自动创建听歌历史记录，会给歌曲访客量加一，如果收藏了此歌曲，听歌次数加一
router.post('/listenSong', auth, verifySongIdExist, listenSong)

router.post('/addComment', auth, verifySongIdExist, addComment)

router.post('/deleteComment', auth, verifySongIdExist, deleteComment)

router.get('/getUserAvatar', getUserAvatar)

router.get('/getAllSingers', getAllSingers)

router.get('/getAllSongsSimpleInfo', getAllSongsSimpleInfo)

router.get('/getSongLyric', getSongLyric)

router.get('/getComment', getComment)

// 用户点赞评论或是取消点赞评论
router.post('/handleFavour', auth, handleFavour)

router.get('/getAllSongKus', getAllSongKus)

module.exports = router

