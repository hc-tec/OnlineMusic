const User = require('../model/user.model')

class UserService {

    async createUser(user_name, password) {
        // 插入数据，相当于users表执行了insert语句，以下简写了user_name: user_name...
        const res = await User.create({ user_name, password })
        return res.dataValues
    }

    async getUserInfoByName(user_name) {
        const res = await User.findOne({
            attributes: ['id', 'user_name', 'password', 'avatar_path', 'is_admin'],
            where: {
                user_name: user_name
            }
        })
        return res ? res.dataValues : null
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
    // 根据id修改头像或密码
    async updateUserById({ id, password, avatar_path }) {
        const whereOpt = { id }
        let newValue = {}
        
        password && (newValue.password = password)
        avatar_path && (newValue.avatar_path = avatar_path)

        const res = await User.update(newValue, { where: whereOpt })

        return !!res[0]
    }
}
 
module.exports = new UserService()