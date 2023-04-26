const path = require('path')

const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaStatic = require('koa-static')

const userRouter = require('./router/user.route')

const app = new Koa()

app.use(KoaBody.koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '../upload'),
        keepExtensions: true
    }
}))
app.use(KoaStatic(path.join(__dirname, '../upload')))
app.use(userRouter.routes())

app.listen(3000, () => {
    console.log('server running on http://localhost:3000')
})