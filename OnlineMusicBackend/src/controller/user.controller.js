const { createUser } = require('../service/user.service')

class UserController {
    async register(ctx) {
        const { user_name, password } = ctx.request.body
        const res = await createUser(user_name, password)
        ctx.body = res
        
    }
}

module.exports = new UserController()