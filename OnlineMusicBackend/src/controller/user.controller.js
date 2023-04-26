const path = require('path')
const fs = require('fs')

const jwt = require('jsonwebtoken')

const { createUser, updateUserById, getUserInfoByName } = require('../service/user.service')

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
        // 从上个中间件取数据, 除了密码外的所有字段均被当成payload(载荷)
        const { id, user_name, avatar_path, is_admin } = ctx.state.userInfo

        ctx.body = {
            code: '0',
            message: '登录成功',
            // 通过私钥（自定义）生成token, 过期时间一天
            result: {
                token: jwt.sign({ id, user_name, avatar_path, is_admin }, 'BINJUR', { expiresIn: '1d' })
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
    // 修改头像
    async changeAvatar(ctx) {
        // 不要通过payload获取可变的量，如avatar_path，token不会实时更新，大坑Fuck
        const { id, user_name } = ctx.state.userInfo
        const { avatar_path } = await getUserInfoByName(user_name)

        const avatarFile = ctx.request.files.file
        const avatarTypes = ['image/jpeg', 'image/png', 'image/webp']
        let delete_flag = false

        if(!avatarFile) {
            ctx.body = {
                code: '10012',
                message: '未选择头像文件',
                result: ''
            }
            return
        }
        else if(!avatarTypes.includes(avatarFile.mimetype)) {
            delete_flag = true
            ctx.body = {
                code: '10013',
                message: '头像文件格式不支持',
                result: ''
            }
        }
        else if(avatarFile.size > 5242880) {
            delete_flag = true
            ctx.body = {
                code: '10014',
                message: '头像文件过大',
                result: ''
            }
        }
        // 删除上传的错误文件
        if(delete_flag) {
            fs.existsSync(avatarFile.filepath) && fs.unlinkSync(avatarFile.filepath)
            return
        }

        const oldAvatarPath = path.join(__dirname, '../../upload/avatar', avatar_path)
        const newAvatarPath = path.join(__dirname, '../../upload/avatar', avatarFile.newFilename)
        // 删除原头像
        if(avatar_path !== 'defaultAvatar.jpg' && fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath)
        }
        // 移动新头像
        fs.renameSync(avatarFile.filepath, newAvatarPath)
        
        // 数据库中更新avatar_path字段
        if(await updateUserById({ id, avatar_path: avatarFile.newFilename })) {
            ctx.body = {
                code: '0',
                message: '修改头像成功',
                result: {
                    newAvatarName: avatarFile.newFilename
                }
            }
        }
        else {
            ctx.body = {
                code: '10015',
                message: '修改头像失败',
                result: ''
            }
        }
    }

}

module.exports = new UserController()