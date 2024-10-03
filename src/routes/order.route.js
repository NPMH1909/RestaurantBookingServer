import express from "express"
import { handleValidationErrors } from "../middlewares/validation.middleware"
import { authenticationAdmin, authenticationStaff, requireApiKey } from "../middlewares/useApiKey.middleware"
import { OrderController } from "../controllers/order.controller"
const OrderRouter = express.Router()

OrderRouter.get(
    '/',
    OrderGetAllValidation,
    handleValidationErrors,
    requireApiKey,
    authenticationAdmin,
    OrderController.getAllOrder
)
OrderRouter.get('/staff', requireApiKey, authenticationStaff, OrderController.getAllOrderByStaffId)
OrderRouter.get('/owner', requireApiKey, authenticationAdmin, OrderController.getAllOrderByUserId)
OrderRouter.get('/order/:id', OrderGetByIdValidation, handleValidationErrors, OrderController.getOrderById)
OrderRouter.get(
    '/confirm/:id',
    requireApiKey,
    OrderGetByIdValidation,
    handleValidationErrors,
    OrderController.confirmOrder
)
OrderRouter.post('/pay/:id', requireApiKey, OrderGetByIdValidation, handleValidationErrors, OrderController.payOrder)
OrderRouter.post('/', requireApiKey, OrderCreateValidation, handleValidationErrors, OrderController.createOrder)

OrderRouter.put(
    '/menu/:id',
    requireApiKey,
    authenticationStaff,
    OrderUpdateValidation,
    handleValidationErrors,
    OrderController.updateOrder
)
OrderRouter.delete('/:id', OrderDeleteValidation, handleValidationErrors, OrderController.deleteOrder)