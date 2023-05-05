const { DataTypes } = require('sequelize')

const seq = require('../db/seq')
const Singer = require('./singer.model')

const Song = seq.define('Song', {

    song_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '歌曲名，可重复'
    },
    singer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Singer,
            key: 'id'
        },
        comment: '外键, 连接歌手表的歌手ID'
    },
    publish_time: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '歌曲发布时间'
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '歌曲对应的文件名'
    },
    visitors: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '访问量'
    },
    lyric: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '纯音乐，请欣赏',
        comment: '歌词'
    }
}, {
    tableName: 'songs',
    timestamps: false
})

// 创建数据表
// Song.sync({ alter: true })

module.exports = Song