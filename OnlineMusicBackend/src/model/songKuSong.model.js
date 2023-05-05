// 记录歌单中有哪些歌曲
const { DataTypes } = require('sequelize')
const seq = require('../db/seq')

const Song = require('./song.model')
const SongKu = require('./songKu.model')

const SongKuSong = seq.define('SongKuSong', {
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
    songku_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
        references: {
            model: SongKu,
            key: 'id'
        },
        comment: '外键, 连接歌单表的歌单ID'
    },
}, {
    tableName: 'songku_songs',
    timestamps: false
})

// 创建数据表
// SongKuSong.sync({ alter: true })

module.exports = SongKuSong