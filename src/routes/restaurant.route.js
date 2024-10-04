import express from "express"
import { RestaurantController } from "../controllers/restaurant.controller.js"
import { RestaurangGetAllValidation, RestaurantCreateValidation, RestaurantDeleteValidation, RestaurantGetByIdValidation, RestaurantUpdateValidation } from "../middlewares/restaurant.middleware.js"
import { authenticationAdmin, requireApiKey } from "../middlewares/useApiKey.middleware.js"
import { handleValidationErrors } from "../middlewares/validation.middleware.js"

const RestaurantRouter = express.Router()

RestaurantRouter.get('/', RestaurangGetAllValidation, handleValidationErrors, RestaurantController.getAllRestaurant)
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
RestaurantRouter.post('/search', RestaurantController.findRestaurantByAnyField)
RestaurantRouter.get('/owner', requireApiKey, authenticationAdmin, RestaurantController.getRestaurantIdAndNameByUserId)
RestaurantRouter.get('/own', requireApiKey, authenticationAdmin, RestaurantController.getAllRestaurantByUserId)

export default RestaurantRouter
