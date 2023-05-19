const { Sequelize } = require('sequelize')

const seq = new Sequelize('onlinemusicdb', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
})

//测试连接
seq.authenticate().then(() => {
    console.log('成功')
}).catch(err => {
    console.log(err)
})

// seq.sync()

module.exports = seq