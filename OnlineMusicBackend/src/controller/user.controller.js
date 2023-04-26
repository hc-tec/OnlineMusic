const jwt = require('jsonwebtoken')

const { createUser, updateUserById } = require('../service/user.service')

// 将执行某个请求的操作写在controller文件夹下
class UserController {
    // 注册
    async register(ctx) {
        const { user_name, password } = ctx.request.body

        const res = await createUser(user_name, password)
        ctx.body = {
            code: '0',
            message: '注册用户成功',
            result: res
        }
    }
    // 首次登录
    async login(ctx) {
        // 从上个中间件取数据, 除了密码外的所有字段均被当成payload(载荷)存储在res(剩余参数)中
        const { password, ...res } = ctx.state.userInfo

        ctx.body = {
            code: '0',
            message: '登录成功',
            // 通过私钥（自定义）生成token, 过期时间一天
            result: {
                token: jwt.sign(res, 'BINJUR', { expiresIn: '1d' })
            }
        }
        
    }
    // 修改密码
    async changePassword(ctx) {
        const { id } = ctx.state.userInfo
        const { password } = ctx.request.body

        if(await updateUserById({ id, password })) {
            ctx.body = {
                code: '0',
                message: '修改密码成功',
                result: ''
            }
        }
        else {
            ctx.body = {
                code: '10010',
                message: '修改密码失败',
                result: ''
            }
        }
    }
}

module.exports = new UserController()