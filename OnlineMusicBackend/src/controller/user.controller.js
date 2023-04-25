const { createUser } = require('../service/user.service')

// 将执行某个请求的操作写在controller文件夹下
class UserController {
    async register(ctx) {
        const { user_name, password } = ctx.request.body

        const res = await createUser(user_name, password)
        ctx.body = {
            code: '0',
            message: '注册用户成功',
            result: res
        }
    }
    async login(ctx) {
        const { user_name, password } = ctx.request.body

        ctx.body = {
            code: '0',
            message: '登录成功',
            result: ''
        }
        
    }
}

module.exports = new UserController()