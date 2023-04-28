const { where } = require('sequelize')
const Singer = require('../model/singer.model')
const Song = require('../model/song.model')

class AdminService {
    // 创建歌手
    async createSinger({ singer_name, birthday, gender, description }) {
        let singerObj = {}

        singer_name && (singerObj.singer_name = singer_name)
        birthday && (singerObj.birthday = birthday)
        description && (singerObj.description = description)

        if(gender != undefined && gender != null) {
            singerObj.gender = gender
        }

        const res = await Singer.create(singerObj)
        return res.dataValues
    }
    // 根据歌手ID跟新歌手信息
    async updateSingerById({ id, singer_name, birthday, gender, description }) {
        let newValue = {}
        const whereOpt = { id }

        singer_name && (newValue.singer_name = singer_name)
        birthday && (newValue.birthday = birthday)
        description && (newValue.description = description)

        if(gender != undefined && gender != null) {
            newValue.gender = gender
        }

        const res = await Singer.update(newValue, { where: whereOpt })
        return !!res[0]
    }
    // 获取歌手信息（通过ID或歌手名）
    async getSingerInfo({ id, singer_name }) {
        let whereOpt = {}

        id && (whereOpt.id = id)
        singer_name && (whereOpt.singer_name = singer_name)

        const res = await Singer.findOne({
            attributes: ['id', 'singer_name', 'birthday', 'gender', 'description'],
            where: whereOpt
        })
        return res ? res.dataValues : null
    }
    // 获得歌手名下所有的歌曲的信息
    async getSongInfoBySingerId(singer_id) {
        const res = await Song.findAll({
            attributes: ['id', 'song_name', 'singer_id', 'publish_time', 'file_name', 'visitors', 'lyric'],
            where: {
                singer_id: singer_id
            }
        })
        return res
    }
    // 创建歌曲
    async createSong({ song_name, singer_id, publish_time, file_name, lyric }) {
        const res = await Song.create({ song_name, singer_id, publish_time, file_name, lyric })
        return res.dataValues
    }
    // 根据歌曲ID修改歌曲部分信息
    async updateSongById({ id, song_name, file_name, lyric }) {
        let newValue = {}
        const whereOpt = { id }

        if(song_name !== undefined ) newValue.song_name = song_name
        if(file_name !== undefined ) newValue.file_name = file_name
        if(lyric !== undefined ) newValue.lyric = lyric

        const res = await Song.update(newValue, { where: whereOpt })

        return !!res[0]
    }

}

module.exports = new AdminService()