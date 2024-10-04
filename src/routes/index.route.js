import MenuRouter from './menu.route.js'
import RestaurantRouter from './restaurant.route.js'
import TableRouter from './table.route.js'
import UserRouter from './user.route.js'
import OrderRouter from './order.route.js'
const route = (app) => {
    app.use('/restaurants', RestaurantRouter)

    app.use('/tables', TableRouter)
  
    app.use('/orders', OrderRouter)
  
    app.use('/menus', MenuRouter)
    
    app.use('/', UserRouter)
}
export default route