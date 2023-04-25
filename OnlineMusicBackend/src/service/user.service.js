const User = require('../model/user.model')

class UserService {

    async createUser(user_name, password) {
        // 插入数据，相当于users表执行了insert语句，以下简写了user_name: user_name...
        const res = await User.create({ user_name, password })
        return res.dataValues
    }

    async getUserIdByName(user_name) {
        const res = await User.findOne({
            attributes: ['id'],
            where: {
                user_name: user_name
            }
        })
        return res.dataValues.id
    }

    async hasUserByName(user_name) {
        const res = await User.findAll({
            attributes: ['id'],
            where: {
                user_name: user_name
            }
        })
        return res.length > 0 ? true : false
    }
}
 
module.exports = new UserService()