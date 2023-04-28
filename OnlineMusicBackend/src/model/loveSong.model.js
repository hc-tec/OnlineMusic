const { DataTypes } = require('sequelize')

const seq = require('../db/seq')
const Song = require('./song.model')
const User = require('./user.model')

const LoveSong = seq.define('LoveSong', {
    song_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
        references: {
            model: Song,
            key: 'id'
        },
        comment: '外键, 连接歌曲表的歌曲ID'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
        references: {
            model: User,
            key: 'id'
        },
        comment: '外键, 连接用户表的用户ID'
    },
    listen_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '既然喜欢, 就统计听歌次数吧'
    }
}, {
    tableName: 'love_songs'
})

// 创建数据表
// LoveSong.sync()

module.exports = LoveSong