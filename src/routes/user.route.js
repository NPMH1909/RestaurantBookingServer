import express from 'express'
import { UserController } from '../controllers/user.controller.js'
import { UserLoginValidation, UserRegisterValidation } from '../middlewares/user.middleware.js'
import { handleValidationErrors } from '../middlewares/validation.middleware.js'
import { authenticationAdmin, requireApiKey } from '../middlewares/useApiKey.middleware.js'

const UserRouter = express.Router()
UserRouter.post('/register',UserRegisterValidation, handleValidationErrors, UserController.register)
UserRouter.post('/login',UserLoginValidation, handleValidationErrors, UserController.loginUser)
UserRouter.post('/auth/login', UserLoginValidation, handleValidationErrors, UserController.loginAdmin)
UserRouter.get('/user', requireApiKey, UserController.getUserById)
UserRouter.put('/user/:id', requireApiKey, UserController.updateUser)
UserRouter.delete('/user/:id', requireApiKey, authenticationAdmin, UserController.deleteUser)
UserRouter.put('/reset-password', UserController.resetPassword)
UserRouter.put('/changePassword',requireApiKey, UserController.changePassword)

export default UserRouter