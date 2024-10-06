import express from "express"
import { RestaurantController } from "../controllers/restaurant.controller.js"
import { RestaurangGetAllValidation, RestaurantCreateValidation, RestaurantDeleteValidation, RestaurantGetByIdValidation, RestaurantUpdateValidation } from "../middlewares/restaurant.middleware.js"
import { authenticationAdmin, requireApiKey } from "../middlewares/useApiKey.middleware.js"
import { handleValidationErrors } from "../middlewares/validation.middleware.js"
import { StaffController } from "../controllers/staff.controller.js"
import { MenuController } from "../controllers/menu.controller.js"
import { TableController } from "../controllers/table.controller.js"

const RestaurantRouter = express.Router()

RestaurantRouter.get(
  '/', 
  RestaurangGetAllValidation, 
  handleValidationErrors, 
  RestaurantController.getAllRestaurant
)
RestaurantRouter.get(
  '/restaurant/:id',
  RestaurantGetByIdValidation,
  handleValidationErrors,
  RestaurantController.getRestaurantById
)

RestaurantRouter.post(
  '/',
  RestaurantCreateValidation,
  handleValidationErrors,
  requireApiKey,
  authenticationAdmin,
  RestaurantController.createRestaurant
)
RestaurantRouter.put(
  '/restaurant/:id',
  RestaurantUpdateValidation,
  handleValidationErrors,
  requireApiKey,
  authenticationAdmin,
  RestaurantController.updateRestaurant
)
RestaurantRouter.delete(
  '/restaurant/:id',
  RestaurantDeleteValidation,
  handleValidationErrors,
  requireApiKey,
  authenticationAdmin,
  RestaurantController.deleteRestaurant
)

RestaurantRouter.get('/owner', 
  requireApiKey, 
  authenticationAdmin, 
  RestaurantController.getRestaurantIdAndNameByUserId
)

RestaurantRouter.get(
  '/own', 
  requireApiKey, 
  authenticationAdmin, 
  RestaurantController.getAllRestaurantByUserId

)
RestaurantRouter.post('/search', RestaurantController.findRestaurantByAnyField)

//Staff
RestaurantRouter.post(
  '/:restaurant_id/register_staff',
  StaffController.registerStaff
)
RestaurantRouter.get(
  '/:restaurant_id/staff',
  StaffController.getAllStaffByRestaurantId
)


//Menu
RestaurantRouter.post(
  '/:restaurant_id/menus/create_menu',
  MenuController.createMenuItem
)
RestaurantRouter.get(
  '/:restaurant_id/menus',
  MenuController.getAllMenuItemByRestaurantId
)

//Table
RestaurantRouter.post(
  '/:restaurant_id/tables/create_table',
  TableController.createTable
)
RestaurantRouter.get(
  '/:restaurant_id/tables',
  TableController.getAllTableByRestaurantId
)
export default RestaurantRouter
