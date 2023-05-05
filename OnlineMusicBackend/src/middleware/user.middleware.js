const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { hasUserByName, getUserInfoByName, querySongInfoById } = require('../service/user.service')
// 中间件 在route请求中使用，满足一定条件调用next()，然后执行下一个中间件

// 验证密码和账号的格式
const userValidator = async (ctx, next) => {
    let { user_name = '', password = '' } = ctx.request.body

    // 合法性判断
    if(!user_name || !password || user_name != user_name.replace(/\s+/g, '') || password != password.replace(/\s+/g, '')) {
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
// 首次登录验证
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
        // 用户存在则将查询到的信息传递到下个中间件——controller下的login
        ctx.state.userInfo = res
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
// 通过token验证是否登录，未登录则不执行下个中间件（此中间件会被频繁使用，例如修改密码，更改头像，发布评论等基本任何请求）
const auth = async (ctx, next) => {
    // 获取请求头中的token
    const { authorization = '' } = ctx.request.header
    const token = authorization.replace('Bearer ', '')
    
    try {
        // 将获取到的payload传递给下个中间件
        ctx.state.userInfo = jwt.verify(token, 'BINJUR')
    }
    catch (error) {
        // token过期
        if(error.name === 'TokenExpiredError') {
            ctx.body = {
                code: '10008',
                message: 'token过期',
                result: ''
            }
            return
        }
        // 无效的token
        else if(error.name === 'JsonWebTokenError') {
            ctx.body = {
                code: '10009',
                message: '无效的token',
                result: ''
            }
            return
        }
    }

    await next()
}

// 收藏歌曲时或取消收藏判断歌曲是否存在
const verifySongIdExist = async (ctx, next) => {
    const { song_id } = ctx.request.body

    const res = await querySongInfoById(song_id)
    if(!res) {
        ctx.body = {
            code: '10031',
            message: '歌曲不存在',
            result: ''
        }
        return
    }

    ctx.state.songInfo = res
    await next()
}

module.exports = {
    userValidator,
    verifyUser,
    cryptPassword,
    verifyLogin,
    auth,
    verifySongIdExist
}