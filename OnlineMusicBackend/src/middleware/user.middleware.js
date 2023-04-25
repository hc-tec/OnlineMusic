const bcrypt = require('bcryptjs')

const { hasUserByName, getUserInfoByName } = require('../service/user.service')
// 中间件 在route请求中使用，满足一定条件调用next()，然后执行下一个中间件

// 验证密码和账号的格式
const userValidator = async (ctx, next) => {
    let { user_name, password } = ctx.request.body

    // 合法性判断
    user_name = user_name.replace(/\s+/g, '')
    password = password.replace(/\s+/g, '')

    if(!user_name || !password) {
        ctx.status = 400
        ctx.body = {
            code: '10001',
            message: '用户名或密码不能为空或包含空格',
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

    await next()
}
// 注册前判断用户是否存在
const verifyUser = async (ctx, next) => {
    const { user_name } = ctx.request.body

    if(await hasUserByName(user_name)) {
        // 合理性判断，即查找有无重复用户
        ctx.status = 400
        ctx.body = {
            code: '10004',
            message: '用户已存在',
            result: ''
        }
        return
    }
    
    await next()
}
// 密码加密
const cryptPassword = async (ctx, next) => {
    const { password } = ctx.request.body

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    ctx.request.body.password = hash

    await next()
}
// 登录前判断用户是否存在
const verifyLogin = async (ctx, next) => {
    const { user_name, password } = ctx.request.body

    try {
        const res = await getUserInfoByName(user_name)
        if(!res) {
            ctx.status = 400
            ctx.body = {
                code: '10005',
                message: '用户不存在',
                result: ''
            }
            return
        }
        // 用户存在则比对密码
        if(!bcrypt.compareSync(password, res.password)) { // 密码不匹配
            ctx.status = 400
            ctx.body = {
                code: '10007',
                message: '密码错误',
                result: ''
            }
            return
        }
    }
    catch (error) {
        ctx.status = 500
        ctx.body = {
            code: '10006',
            message: '登录失败',
            result: ''
        }
        return
    }

    await next()
}
module.exports = {
    userValidator,
    verifyUser,
    cryptPassword,
    verifyLogin
}