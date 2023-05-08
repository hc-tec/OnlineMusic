const path = require('path')
const fs = require('fs')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { createUser, updateUserById, getUserInfoByName, createLoveSong, deleteLoveSong, queryLoveSongByUserId, updateLoveSong, updateHistorySong, createHistorySong, createComment, queryCommentInfo, deleteComment } = require('../service/user.service')
const { updateSongById } = require('../service/admin.service')

// 将执行某个请求的操作写在controller文件夹下
class UserController {
    // 注册
    async register(ctx) {
        const { user_name, password } = ctx.request.body

        const res = await createUser(user_name, password)
        ctx.body = {
            code: '0',
            message: '注册用户成功',
            result: res
        }
    }
    // 首次登录
    async login(ctx) {
        // 从上个中间件取数据, 所有基本不变的字段均被当成payload(载荷)
        const { id, user_name, is_admin, avatar_path } = ctx.state.userInfo

        ctx.body = {
            code: '0',
            message: '登录成功',
            // 通过私钥（自定义）生成token, 过期时间一天
            result: {
                token: jwt.sign({ id, user_name, is_admin }, 'BINJUR', { expiresIn: '1d' }),
                userInfo: { id, user_name, is_admin, avatar_path }
            }
        }
        
    }
    // 通过token的自动登录
    async autoLogin(ctx) {
        const { id, user_name, is_admin } = ctx.state.userInfo
        const { avatar_path } = await getUserInfoByName(user_name)

        ctx.body = {
            code: '0',
            message: '登录成功',
            result: {
                userInfo: { id, user_name, is_admin, avatar_path }
            }
        }
    }
    // 修改密码
    async changePassword(ctx) {
        const { id, user_name } = ctx.state.userInfo
        const { password, old_password } = ctx.request.body

        const res = await getUserInfoByName(user_name)

        if(!bcrypt.compareSync(old_password, res.password)) {
            ctx.body = {
                code: '10003',
                message: '原密码错误',
                result: ''
            }
            return
        }


        if(await updateUserById({ id, password })) {
            ctx.body = {
                code: '0',
                message: '修改密码成功',
                result: ''
            }
        }
        else {
            ctx.body = {
                code: '10010',
                message: '修改密码失败',
                result: ''
            }
        }
    }
    // 修改头像
    async changeAvatar(ctx) {
        // 不要通过payload获取可变的量，如avatar_path，token不会实时更新，大坑fuck
        const { id, user_name } = ctx.state.userInfo
        const { avatar_path } = await getUserInfoByName(user_name)

        const avatarFile = ctx.request.files.file
        const avatarTypes = ['image/jpeg', 'image/png', 'image/webp']
        let delete_flag = false

        if(!avatarFile) {
            ctx.body = {
                code: '10012',
                message: '未选择头像文件',
                result: ''
            }
            return
        }
        else if(!avatarTypes.includes(avatarFile.mimetype)) {
            delete_flag = true
            ctx.body = {
                code: '10013',
                message: '头像文件格式不支持',
                result: ''
            }
        }
        else if(avatarFile.size > 5242880) {
            delete_flag = true
            ctx.body = {
                code: '10014',
                message: '头像文件过大',
                result: ''
            }
        }
        // 删除上传的错误文件
        if(delete_flag) {
            fs.existsSync(avatarFile.filepath) && fs.unlinkSync(avatarFile.filepath)
            return
        }

        const oldAvatarPath = path.join(__dirname, '../../upload/avatar', avatar_path)
        const newAvatarPath = path.join(__dirname, '../../upload/avatar', avatarFile.newFilename)
        // 删除原头像
        if(avatar_path !== 'defaultAvatar.jpg' && fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath)
        }
        // 移动新头像
        fs.renameSync(avatarFile.filepath, newAvatarPath)
        
        // 数据库中更新avatar_path字段
        if(await updateUserById({ id, avatar_path: avatarFile.newFilename })) {
            ctx.body = {
                code: '0',
                message: '修改头像成功',
                result: {
                    newAvatarName: avatarFile.newFilename
                }
            }
        }
        else {
            ctx.body = {
                code: '10015',
                message: '修改头像失败',
                result: ''
            }
        }
    }
    // 添加歌曲至我喜欢
    async addLoveSong(ctx) {
        try {
            const user_id = ctx.state.userInfo.id
            const { song_id } = ctx.request.body

            const loveSongInfo = await queryLoveSongByUserId(user_id)

            if(loveSongInfo.find((item) => {
                return item.song_id == song_id
            })) {
                ctx.body = {
                    code: '10031',
                    message: '你已收藏该音乐',
                    result: ''
                }
                return
            }

            const res = await createLoveSong(user_id, song_id)
            ctx.body = {
                code: '0',
                message: '收藏歌曲成功',
                result: res
            }
        }
        catch (err) {
            ctx.body = {
                code: '10029',
                message: '收藏歌曲失败',
                result: ''
            }
        }
    }
    // 将歌曲从我喜欢中移除
    async deleteLoveSong(ctx) {
        try {
            const user_id = ctx.state.userInfo.id
            const { song_id } = ctx.request.body
            const res = await deleteLoveSong(user_id, song_id)
            ctx.body = {
                code: '0',
                message: '取消收藏歌曲成功',
                result: res
            }
        }
        catch (err) {
            ctx.body = {
                code: '10030',
                message: '取消收藏歌曲失败',
                result: ''
            }
        }
    }
    // 听了一次歌引起数据变化
    async listenSong(ctx) {
        const { song_id } = ctx.request.body
        const user_id = ctx.state.userInfo.id
        const { id, song_name, singer_id, publish_time, file_name, visitors, lyric } = ctx.state.songInfo

        const res = await updateSongById({ id: song_id, visitors: visitors + 1 })
        if(!res) {
            ctx.body = {
                code: '10032',
                message: '更新访客量失败',
                result: ''
            }
            return
        }

        // 判断该歌曲是否在收藏中
        const loveSongs = await queryLoveSongByUserId(user_id)
        let listen_num = undefined

        for (const item of loveSongs) {
            if(item.song_id == song_id) {
                listen_num = item.listen_num + 1
                if(!await updateLoveSong(user_id, song_id, listen_num)) {
                    ctx.body = {
                        code: '10033',
                        message: '更新收藏歌曲播放次数失败',
                        result: ''
                    }
                    return
                }
                break
            }
        }

        // 创建或更新历史记录
        const listen_time = new Date()
        const updateSuccessFlag = await updateHistorySong(user_id, song_id, listen_time)

        if(!updateSuccessFlag) {
            await createHistorySong(user_id, song_id, listen_time)
        }

        ctx.body = {
            code: '0',
            message: '一次听歌的的数据变化已完成',
            result: {
                songInfo: { id, song_name, singer_id, publish_time, file_name, lyric,
                    visitors: visitors + 1
                },
                listen_num,
                listen_time
            }
        }
    }
    // 添加评论
    async addComment(ctx) {
        const user_id = ctx.state.userInfo.id
        const { song_id, content } = ctx.request.body

        if(!content) {
            ctx.body = {
                code: '10034',
                message: '评论不能为空',
                result: ''
            }
            return
        }

        const res = await createComment(user_id, song_id, content, new Date())
        ctx.body = {
            code: '0',
            message: '添加评论成功',
            result: res
        }
    }
    // 用户删除自己的评论
    async deleteComment(ctx) {
        const user_id = ctx.state.userInfo.id
        const { comment_id } = ctx.request.body

        const res = await queryCommentInfo({ comment_id })
        if(res.user_id != user_id) {
            ctx.body = {
                code: '10035',
                message: '不能删除其他人的评论',
                result: ''
            }
            return
        }
        

        const result = await deleteComment(comment_id)
        if(!result) {
            ctx.body = {
                code: '10036',
                message: '删除评论失败',
                result: ''
            }
            return
        }
        ctx.body = {
            code: '0',
            message: '删除评论成功',
            result: result
        }
    }
    // 用户登录时获得头像
    async getUserAvatar(ctx) {
        const { user_name } = ctx.query
        const res = await getUserInfoByName(user_name)
        if(res) {
            ctx.body = {
                code: '0',
                message: '获取头像成功',
                result: res.avatar_path
            }
            return
        }
        ctx.body = {
            code: '10005',
            message: '用户不存在',
            result: ''
        }
        return

    }
}

module.exports = new UserController()