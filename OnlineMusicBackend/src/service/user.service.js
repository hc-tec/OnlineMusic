const LoveSong = require('../model/loveSong.model')
const Song = require('../model/song.model')
const User = require('../model/user.model')
const HistorySong = require('../model/historySong.model')
const Comment = require('../model/comment.model')
const Singer = require('../model/singer.model')
const UserComment = require('../model/userComment.model')
class UserService {

    async createUser(user_name, password) {
        // 插入数据，相当于users表执行了insert语句，以下简写了user_name: user_name...
        const res = await User.create({ user_name, password })
        return res.dataValues
    }

    async getUserInfoByName(user_name) {
        const res = await User.findOne({
            attributes: ['id', 'user_name', 'password', 'avatar_path', 'is_admin'],
            where: {
                user_name: user_name
            }
        })
        return res ? res.dataValues : null
    }
    async getUserInfoById(id) {
        const res = await User.findOne({
            attributes: ['id', 'user_name', 'password', 'avatar_path', 'is_admin'],
            where: {
                id: id
            }
        })
        return res ? res.dataValues : null
    }

    async hasUserByName(user_name) {
        const res = await User.findAll({
            attributes: ['id'],
            where: {
                user_name: user_name
            }
        })
        return res.length > 0 ? true : false
    }
    // 根据id修改头像或密码
    async updateUserById({ id, password, avatar_path }) {
        const whereOpt = { id }
        let newValue = {}
        
        password && (newValue.password = password)
        avatar_path && (newValue.avatar_path = avatar_path)

        const res = await User.update(newValue, { where: whereOpt })

        return !!res[0]
    }
    // 根据歌曲id获取歌曲信息
    async querySongInfoById(id) {
        const res = await Song.findOne({
            attributes: ['id', 'song_name', 'singer_id', 'publish_time', 'file_name', 'visitors', 'lyric'],
            where: { id }
        })
        return res ? res.dataValues : null
    }
    // 根据用户id查询所有该用户收藏的所有歌曲的id和listen_num
    async queryLoveSongByUserId(user_id) {
        const res = await LoveSong.findAll({
            attributes: ['song_id', 'listen_num'],
            where: { user_id }
        })
        return res
    }
    // 添加收藏音乐的记录
    async createLoveSong(user_id, song_id) {
        const res = await LoveSong.create({ user_id, song_id })
        return res.dataValues
    }
    // 删除收藏音乐的记录
    async deleteLoveSong(user_id, song_id) {
        const res = await LoveSong.destroy({
            where: { user_id, song_id }
        })
        return res
    }
    // 更新收藏音乐表的访客量数据
    async updateLoveSong(user_id, song_id, listen_num) {
        const res = await LoveSong.update({ listen_num }, { where: { user_id, song_id } })
        return !!res[0]
    }
    // 创建歌曲历史记录
    async createHistorySong(user_id, song_id, listen_time) {
        const res = await HistorySong.create({ user_id, song_id, listen_time })
        return res.dataValues
    }
    //更新歌曲历史记录
    async updateHistorySong(user_id, song_id, listen_time) {
        const res = await HistorySong.update({ listen_time }, { where: { user_id, song_id } })
        return !!res[0]
    }
    // 创建评论
    async createComment(user_id, song_id, content, publish_time) {
        const res = await Comment.create({ user_id, song_id, content, publish_time })
        return res.dataValues
    }
    // 根据评论id或歌曲id获取评论信息
    async queryCommentInfo({ comment_id, song_id }) {
        if(comment_id != undefined) {
            const res = await Comment.findOne({
                attributes: ['user_id'],
                where: { id: comment_id }
            })
            return res ? res.dataValues : null
        }
        else {
            const res = await Comment.findAll({
                attributes: ['id', 'content', 'song_id', 'user_id', 'favour', 'publish_time'],
                where: { song_id }
            })
            return res
        }
    }
    // 删除评论
    async deleteComment(id) {
        return await Comment.destroy({ where: { id } })
    }
    // 查询所有歌手信息
    async queryAllSingers() {
        const res = await Singer.findAll({
            attributes: ['id', 'singer_name', 'birthday', 'gender', 'description'],
        })
        return res
    }
    // 查询所有歌曲信息
    async queryAllSongs(includeLyric, singer_id) {
        let attributes = ['id', 'song_name', 'singer_id', 'publish_time', 'file_name', 'visitors']
        if(includeLyric) attributes.push('lyric')

        if(singer_id === undefined) {
            return await Song.findAll({ attributes })
        }
        else {
            return await Song.findAll({
                attributes,
                where: {
                    singer_id
                }
            })
        }
    }
    // 查询评论点赞状态
    async queryUserCommentState({ user_id, comment_id }) {
        const res = await UserComment.findOne({
            attributes: ['has_zan'],
            where: {
                user_id,
                comment_id
            }
        })
        return res ? res.dataValues : null
    }
    // 更新评论信息（更新点赞数量）
    async updateCommentById(id, favour) {
        const res = await Comment.update({ favour }, { where: { id } })
        return !!res[0]
    }
    // 更新用户评论点赞状态
    async updateUserComment(user_id, comment_id, has_zan) {
        await UserComment.findOrCreate({
            where: { user_id, comment_id },
            defaults: {
                user_id,
                comment_id,
                has_zan
            }
        })
        const res = await UserComment.update({ has_zan }, { where: { user_id, comment_id } })
        return !!res[0]
    }


}
 
module.exports = new UserService()