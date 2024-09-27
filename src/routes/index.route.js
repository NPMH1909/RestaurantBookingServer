import UserRouter from './user.route.js'

const route = (app) => {
    app.use('/user', UserRouter)
}
export default route