const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')

const { createSinger, updateSingerById, createSong, updateSongById, queryAllUsers, deleteUserById, deleteSongById, deleteSingerById } = require('../service/admin.service')
const { updateUserById, queryAllSongs } = require('../service/user.service')

class AdminController {
    async addSinger(ctx) {
        const { singer_name, birthday, gender, description } = ctx.request.body
        
        const res = await createSinger({ singer_name, birthday, gender, description })
        ctx.body = {
            code: '0',
            message: '歌手添加成功',
            result: res
        }
        
    }

    async changeSinger(ctx) {
        const { id, singer_name, birthday, gender, description } = ctx.request.body

        const res = await updateSingerById({ id, singer_name, birthday, gender, description })
        if(res) {
            ctx.body = {
                code: '0',
                message: '歌手信息修改成功',
                result: res
            }
        }
        else{
            ctx.body = {
                code: '10028',
                message: '歌手信息修改失败',
                result: ''
            }
        }

    }

    async addSong(ctx) {
        const { singer_name } = ctx.state.singerInfo
        let { song_name, singer_id, lyric } = ctx.request.body
        const songFile = ctx.request.files.file

        // 处理音乐文件
        const file_name = songFile.newFilename
        const newSongPath = path.join(__dirname, '../../upload/song', file_name)
        fs.renameSync(songFile.filepath, newSongPath)

        const publish_time = new Date()
        if(!lyric) lyric = undefined
        const res = await createSong({ song_name, singer_id, publish_time, file_name, lyric })

        ctx.body = {
            code: '0',
            message: '添加歌曲成功',
            result: {
                songInfo: res,
                singer_name
            }
        }
    }

    async changeSong(ctx) {
        const { id, song_name, lyric, old_file_name } = ctx.request.body
        const songFile = ctx.request.files.file
        let newValue = { id }
        let oldSongPath, newSongPath

        // 传递了新音乐文件则删除旧文件
        if(songFile) {
            newValue.file_name = songFile.newFilename
            oldSongPath = path.join(__dirname, '../../upload/song', old_file_name)
            newSongPath = path.join(__dirname, '../../upload/song', songFile.newFilename)

            fs.existsSync(oldSongPath) && fs.unlinkSync(oldSongPath)
            fs.renameSync(songFile.filepath, newSongPath)
        }

        if(song_name) newValue.song_name = song_name
        if(lyric) {
            newValue.lyric = lyric
        }
        else {
            newValue.lyric = '纯音乐，请欣赏'
        }

        if(await updateSongById(newValue)) {
            ctx.body = {
                code: '0',
                message: '修改歌曲信息成功',
                result: ''
            }
        }
        else{
            ctx.body = {
                code: '10027',
                message: '修改歌曲信息失败',
                result: ''
            }
        }
    }
    // 获得所有用户的信息
    async getAllUsers(ctx) {
        const res = await queryAllUsers()
        ctx.body = {
            code: '0',
            message: '获取用户信息成功',
            result: res
        }
    }
    // 重置用户密码
    async resetPassword(ctx) {
        const { id } = ctx.request.body
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync('123456', salt)
        const res = await updateUserById({ id: id, password: hash })
        if(res) {
            ctx.body = {
                code: '0',
                message: '重置密码成功',
                result: id
            }
            return
        }
        ctx.body = {
            code: '10037',
            message: '重置密码失败',
            result: ''
        }
    }
    // 删除用户
    async deleteUser(ctx) {
        const { id, avatar_path } = ctx.request.body
        const oldAvatarPath = path.join(__dirname, '../../upload/avatar', avatar_path)
        // 删除头像
        if(avatar_path !== 'defaultAvatar.jpg' && fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath)
        }
        const res  = await deleteUserById(id)
        if(res) {
            ctx.body = {
                code: '0',
                message: '删除用户成功',
                result: res
            }
            return
        }
        ctx.body = {
            code: '10038',
            message: '删除用户失败',
            result: ''
        }
    }
    // 删除歌曲
    async deleteSong(ctx) {
        const { id, file_name } = ctx.request.body
        const songPath = path.join(__dirname, '../../upload/song', file_name)
        // 删除歌曲文件
        fs.existsSync(songPath) && fs.unlinkSync(songPath)
        const res  = await deleteSongById(id)
        if(res) {
            ctx.body = {
                code: '0',
                message: '删除歌曲成功',
                result: res
            }
            return
        }
        ctx.body = {
            code: '10041',
            message: '删除歌曲失败',
            result: ''
        }

    }
    // 删除歌手及其歌曲
    async deleteSinger(ctx) {
        const { id } = ctx.request.body
        const songList = await queryAllSongs(false, id)
        // 歌手名下存在歌曲则删除歌曲
        if(songList.length) {
            await (async () => {
                for await (const item of songList) {
                    const songPath = path.join(__dirname, '../../upload/song', item.file_name)
                    fs.existsSync(songPath) && fs.unlinkSync(songPath)
                    await deleteSongById(item.id)
                }
            })()
        }

        const res = await deleteSingerById(id)
        if(res) {
            ctx.body = {
                code: '0',
                message: '删除歌手成功',
                result: res
            }
            return
        }
        ctx.body = {
            code: '10042',
            message: '删除歌手失败',
            result: ''
        }
    }
}

module.exports = new AdminController()