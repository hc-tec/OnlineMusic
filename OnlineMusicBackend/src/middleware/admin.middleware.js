const fs = require('fs')

const { getSingerInfo, getSongInfoBySingerId, queryAllSongKus } = require('../service/admin.service')

const { isSongNameValid } = require('../utils/vaildCheck')

// 是否有管理员权限
const hasAdminPermission = async (ctx, next) => {
    const { is_admin } = ctx.state.userInfo

    if(!is_admin) {
        ctx.body = {
            code: '10011',
            message: '没有管理员权限',
            result: ''
        }
        return
    }

    await next()
}
// 验证添加 修改歌手时的参数
const verifySinger = async (ctx, next) => {
    const { id, singer_name, birthday } = ctx.request.body
    // 日期处理
    birthday && (ctx.request.body.birthday = new Date(birthday))

    if(!isSongNameValid(singer_name)) {
        ctx.body = {
            code: '10016',
            message: '歌手名不合法',
            result: ''
        }
        return
    }
    else if(ctx.request.url == '/addSinger' && await getSingerInfo({ singer_name })) {
        ctx.body = {
            code: '10017',
            message: '歌手已存在',
            result: ''
        }
        return
    }
    else if (ctx.request.url == '/changeSinger') {
        const res = await getSingerInfo({ singer_name })
        if (res && res.id != id) {
            ctx.body = {
                code: '10017',
                message: '歌手已存在',
                result: ''
            }
            return
        }
    }

    await next()
}
// 验证上传歌曲时的参数、歌曲文件
const verifySong = async (ctx, next) => {
    const { song_name, singer_id } = ctx.request.body
    const songFile = ctx.request.files.file

    if(!songFile) {
        ctx.body = {
            code: '10019',
            message: '未选择音乐文件',
            result: ''
        }
        return
    }
    else if(!isSongNameValid(song_name)) {
        fs.existsSync(songFile.filepath) && fs.unlinkSync(songFile.filepath)
        ctx.body = {
            code: '10020',
            message: '歌曲名不合法',
            result: ''
        }
        return
    }
    else if(singer_id === undefined || singer_id === null) {
        fs.existsSync(songFile.filepath) && fs.unlinkSync(songFile.filepath)
        ctx.body = {
            code: '10021',
            message: '新增歌曲需指定歌手名',
            result: ''
        }
        return
    }
    else if(songFile.mimetype !== 'audio/mpeg') {
        fs.existsSync(songFile.filepath) && fs.unlinkSync(songFile.filepath)
        ctx.body = {
            code: '10022',
            message: '音乐文件格式不支持',
            result: ''
        }
        return
    }
    else if(songFile.size > 10485760) { // 10M
        fs.existsSync(songFile.filepath) && fs.unlinkSync(songFile.filepath)
        ctx.body = {
            code: '10023',
            message: '音乐文件过大',
            result: ''
        }
        return
    }

    // 得到歌手信息
    const res = await getSingerInfo({ id: singer_id })
    if(!res) {
        fs.existsSync(songFile.filepath) && fs.unlinkSync(songFile.filepath)
        ctx.body = {
            code: '10024',
            message: '歌手不存在',
            result: ''
        }
        return
    }

    const resArr = await getSongInfoBySingerId(singer_id)
    if(resArr.length) {
        // 检测歌手是否有同名的歌曲
        const hasExistSong = resArr.find((item) => {
            return item.song_name == song_name
        })
        if(hasExistSong) {
            fs.existsSync(songFile.filepath) && fs.unlinkSync(songFile.filepath)
            ctx.body = {
                code: '10025',
                message: '该歌手下相同名称的歌曲已存在',
                result: ''
            }
            return
        }
    }

    // 将歌手信息传给下个中间件
    ctx.state.singerInfo = res

    await next()
}
// 验证修改歌曲信息时的参数文件
const verifyChangeSong = async (ctx, next) => {
    const { id, song_name, singer_id } = ctx.request.body
    const songFile = ctx.request.files.file

    if(!id) {
        ctx.body = {
            code: '10026',
            message: '未传递歌曲ID',
            result: ''
        }
        return
    }

    if(song_name && !isSongNameValid(song_name)) {
        ctx.body = {
            code: '10020',
            message: '歌曲名不合法',
            result: ''
        }
        return
    }

    if(songFile) {
        if(songFile.mimetype !== 'audio/mpeg') {
            fs.existsSync(songFile.filepath) && fs.unlinkSync(songFile.filepath)
            ctx.body = {
                code: '10022',
                message: '音乐文件格式不支持',
                result: ''
            }
            return
        }
        if(songFile.size > 10485760) { // 10M
            fs.existsSync(songFile.filepath) && fs.unlinkSync(songFile.filepath)
            ctx.body = {
                code: '10023',
                message: '音乐文件过大',
                result: ''
            }
            return
        }
    }

    // 继续验证歌曲名是否重复
    const resArr = await getSongInfoBySingerId(singer_id)
    if(resArr.length) {
        // 检测歌手是否有同名的歌曲
        const hasExistSong = resArr.find((item) => {
            return item.song_name == song_name && item.id != id
        })
        if(hasExistSong) {
            songFile && fs.existsSync(songFile.filepath) && fs.unlinkSync(songFile.filepath)
            ctx.body = {
                code: '10025',
                message: '该歌手下相同名称的歌曲已存在',
                result: ''
            }
            return
        }
    }
    await next()
}

const verifySongKu = async (ctx, next) => {
    const { id, ku_name } = ctx.request.body
    const kuFile = ctx.request.files.file
    const songKuTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!isSongNameValid(ku_name)) {
        kuFile && fs.existsSync(kuFile.filepath) && fs.unlinkSync(kuFile.filepath)
        ctx.body = {
            code: '10046',
            message: '歌单名不合法',
            result: ''
        }
        return
    }

    if(ctx.request.url != '/addSongKu') {
        if(!id) {
            kuFile && fs.existsSync(kuFile.filepath) && fs.unlinkSync(kuFile.filepath)
            ctx.body = {
                code: '10047',
                message: '缺少歌单ID参数',
                result: ''
            }
            return
        }
        const res = await queryAllSongKus({ ku_name })
        if(res[0].id != id) {
            kuFile && fs.existsSync(kuFile.filepath) && fs.unlinkSync(kuFile.filepath)
            ctx.body = {
                code: '10050',
                message: '歌单已存在',
                result: ''
            }
            return
        }
    }
    else {
        const res = await queryAllSongKus({ ku_name })
        if(res.length) { // 存在该歌单 
            kuFile && fs.existsSync(kuFile.filepath) && fs.unlinkSync(kuFile.filepath)
            ctx.body = {
                code: '10050',
                message: '歌单已存在',
                result: ''
            }
            return
        }
    }
    // 判断歌单封面
    if(kuFile && !songKuTypes.includes(kuFile.mimetype)) {
        fs.existsSync(kuFile.filepath) && fs.unlinkSync(kuFile.filepath)
        ctx.body = {
            code: '10048',
            message: '封面文件格式不支持',
            result: ''
        }
        return
    }
    if(kuFile && kuFile.size > 5242880) {
        fs.existsSync(kuFile.filepath) && fs.unlinkSync(kuFile.filepath)
        ctx.body = {
            code: '10049',
            message: '封面文件过大',
            result: ''
        }
        return
    }

    await next()
}

module.exports = {
    hasAdminPermission,
    verifySong,
    verifyChangeSong,
    verifySinger,
    verifySongKu,
}