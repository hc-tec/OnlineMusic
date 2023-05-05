// 歌单表，记录有哪些歌单
const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

const SongKu = seq.define('SongKu', {
    ku_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '歌单名'
    },
    file_path: {
        type: DataTypes.STRING,
        defaultValue: 'defaultSongKu.jpg',
        comment: '歌单封面对应的文件名'
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '歌单简介'
    }

}, {
    tableName: 'songkus',
    timestamps: false
})

// 创建数据表
// SongKu.sync({ alter: true })

module.exports = SongKu