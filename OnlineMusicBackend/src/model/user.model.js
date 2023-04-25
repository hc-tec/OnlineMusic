const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

// 模型是数据库中表的虚拟形态，可以理解为就是一张表
const User = seq.define('User', {
    // 在这里定义模型属性
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '用户名，唯一'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '密码'
    },
    avatar_path: {
        type: DataTypes.STRING,
        defaultValue: 'defaultAvatar.jpg',
        comment: '头像对应图片的文件名'
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '是否为管理员 0不是 1是'
    }
}, {
    tableName: 'users'
})

// 创建数据表
// User.sync()

module.exports = User