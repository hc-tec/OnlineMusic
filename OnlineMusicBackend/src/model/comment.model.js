const { DataTypes } = require('sequelize')

const seq = require('../db/seq')
const Song = require('./song.model')
const User = require('./user.model')

const Comment = seq.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: '评论具体内容'
    },
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
    favour: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '评论的获赞数/喜欢数'
    },
    publish_time: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '评论发布时间'
    },
}, {
    tableName: 'comments'
})

// 创建数据表
// Comment.sync({ alter: true })

module.exports = Comment