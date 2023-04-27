const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

const Singer = seq.define('Singer', {

    singer_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '歌手名'
    },
    birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: '生日'
    },
    gender: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: '性别'
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '简介'
    }
}, {
    tableName: 'singers'
})

// 创建数据表
// Singer.sync()

module.exports = Singer