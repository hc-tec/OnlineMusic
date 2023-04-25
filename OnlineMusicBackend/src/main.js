const Koa = require('koa')
const KoaBody = require('koa-body')

const userRouter = require('./router/user.route')

const app = new Koa()

app.use(KoaBody.koaBody())
app.use(userRouter.routes())

app.listen(3000, () => {
    console.log('server running on http://localhost:3000')
})