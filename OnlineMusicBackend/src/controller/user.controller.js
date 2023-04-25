const { createUser, hasUserByName } = require('../service/user.service')

class UserController {
    async register(ctx) {
        const { user_name, password } = ctx.request.body

        // 合法性判断
        if(!user_name || !password) {
            ctx.status = 400
            ctx.body = {
                code: '10001',
                message: '用户名或密码不能为空',
                result: ''
            }
            return
        }
        else if(user_name.length > 7 || password.length > 12) {
            ctx.status = 400
            ctx.body = {
                code: '10002',
                message: '用户名或密码长度过大',
                result: ''
            }
            return
        }
        else if(/[^0-9A-z]/g.test(password)) {
            ctx.status = 400
            ctx.body = {
                code: '10003',
                message: '密码含非法字符',
                result: ''
            }
            return
        }
        else if(await hasUserByName(user_name)) {
            // 合理性判断，即查找有无重复用户
            ctx.status = 400
            ctx.body = {
                code: '10004',
                message: '用户已存在',
                result: ''
            }
            return
        }


        const res = await createUser(user_name, password)
        ctx.body = {
            code: '0',
            message: '注册用户成功',
            result: res
        }
  
    }
}

module.exports = new UserController()