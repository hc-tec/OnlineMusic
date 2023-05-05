// 记录用户是否点了某个评论的赞
const { DataTypes } = require('sequelize')
const seq = require('../db/seq')

const User = require('./user.model')
const Comment = require('./comment.model')

const UserComment = seq.define('UserComment', {
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
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
        references: {
            model: Comment,
            key: 'id'
        },
        comment: '外键, 连接评论表的用户ID'
    },
    has_zan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '用户是否赞了这个评论'
    }
}, {
    tableName: 'user_comments',
    timestamps: false
})

// 创建数据表
// UserComment.sync({ alter: true })

module.exports = UserComment