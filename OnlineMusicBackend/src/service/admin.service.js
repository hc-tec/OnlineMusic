const Singer = require('../model/singer.model')
const Song = require('../model/song.model')
const User = require('../model/user.model')
const Comment = require('../model/comment.model')
const SongKu = require('../model/songKu.model')
const SongKuSong = require('../model/songKuSong.model')


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

        newValue.singer_name = singer_name
        newValue.birthday = birthday != undefined ? birthday : null
        newValue.gender = gender != undefined ? gender : null
        newValue.description = description != undefined ? description : null

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
    async updateSongById({ id, song_name, file_name, lyric, visitors }) {
        let newValue = {}
        const whereOpt = { id }

        if(song_name !== undefined ) newValue.song_name = song_name
        if(file_name !== undefined ) newValue.file_name = file_name
        if(lyric !== undefined ) newValue.lyric = lyric
        if(visitors !== undefined) newValue.visitors = visitors

        const res = await Song.update(newValue, { where: whereOpt })

        return !!res[0]
    }
    // 获取所有用户信息
    async queryAllUsers() {
        const res = await User.findAll({
            attributes: ['id', 'avatar_path', 'is_admin', 'user_name'],
        })
        return res
    }
    // 根据用户ID删除用户
    async deleteUserById(id) {
        const res = await User.destroy({
            where: { id }
        })
        return res
    }
    // 根据歌曲ID删除歌曲
    async deleteSongById(id) {
        const res = await Song.destroy({
            where: { id }
        })
        return res
    }
    // 根据歌曲ID删除歌曲
    async deleteSingerById(id) {
        const res = await Singer.destroy({
            where: { id }
        })
        return res
    }
    // 查询所有评论信息
    async queryAllComments() {
        const res = await Comment.findAll({
            attributes: ['id', 'content', 'song_id', 'user_id', 'favour', 'publish_time'],
        })
        return res
    }
    // 查询所有歌单信息
    async queryAllSongKus({ id, ku_name }) {
        let whereOpt = {}
        id && (whereOpt.id = id)
        ku_name && (whereOpt.ku_name = ku_name)
        
        const res = await SongKu.findAll({
            attributes: ['id', 'ku_name', 'file_path', 'description'],
            where: whereOpt
        })
        return res
    }
    // 新建歌单
    async createSongKu({ ku_name, file_path, description }) {
        let songKuObj = {}

        ku_name && (songKuObj.ku_name = ku_name)
        file_path && (songKuObj.file_path = file_path)
        description && (songKuObj.description = description)

        const res = await SongKu.create(songKuObj)
        return res.dataValues
    }
    // 删除歌单
    async deleteSongKuById(id) {
        const res = await SongKu.destroy({
            where: { id }
        })
        return res
    }
    // 添加歌曲到歌单
    async createSongKuSong(song_id, songku_id) {
        const res = await SongKuSong.create({ song_id, songku_id })
        return res.dataValues
    }
    // 从歌单删除歌曲
    async deleteSongKuSong(song_id, songku_id) {
        const res = await SongKuSong.destroy({
            where: { song_id, songku_id }
        })
        return res
    }

}

module.exports = new AdminService()