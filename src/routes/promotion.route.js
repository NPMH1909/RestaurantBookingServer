import express from "express"
import { PromotioController } from "../controllers/promotion.controller"
import { handleValidationErrors } from "../middlewares/validation.middleware"
import { authenticationAdmin } from "../middlewares/useApiKey.middleware"
const PromotionRouter = express.Router()

PromotionRouter.get('/', handleValidationErrors, authenticationAdmin, PromotioController.getAllPromotion)
PromotionRouter.get('/',  handleValidationErrors, authenticationAdmin, PromotioController.getPromotionById)
PromotionRouter.post('/', handleValidationErrors, authenticationAdmin, PromotioController.createPromotion)
PromotionRouter.put('/',  handleValidationErrors, authenticationAdmin, PromotioController.updatePromotion)
PromotionRouter.delete('/',  handleValidationErrors, authenticationAdmin, PromotioController.deletePromotion)

export default PromotionRouter
