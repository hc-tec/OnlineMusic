const path = require('path')
const fs = require('fs')

const { createSinger, getSingerInfo, createSong, updateSongById } = require('../service/admin.service')
const isNameValid = require('../isNameValid')

class AdminController {
    async addSinger(ctx) {
        let { singer_name = '', birthday, gender, description } = ctx.request.body
        // 日期处理
        birthday = new Date(birthday)

        if(!isNameValid(singer_name)) {
            ctx.body = {
                code: '10016',
                message: '歌手名不合法',
                result: ''
            }
            return
        }
        else if(await getSingerInfo({ singer_name })) {
            ctx.body = {
                code: '10017',
                message: '歌手已存在',
                result: ''
            }
            return
        }
        
        const res = await createSinger({ singer_name, birthday, gender, description })
        ctx.body = {
            code: '10018',
            message: '歌手添加成功',
            result: res
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
        if(lyric) newValue.lyric = lyric

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
}

module.exports = new AdminController()