const { DataTypes } = require('sequelize')

const seq = require('../db/seq')
const Song = require('./song.model')
const User = require('./user.model')

const HistorySong = seq.define('HistorySong', {
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
    listen_time: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '最后听歌时间'
    }
}, {
    tableName: 'history_songs'
})

// 创建数据表
// HistorySong.sync()

module.exports = HistorySong