import express from 'express'
import { UserController } from '../controllers/user.controller.js'
import { UserLoginValidation } from '../middlewares/user.middleware.js'
import { handleValidationErrors } from '../middlewares/validation.middleware.js'
import { authenticationAdmin, requireApiKey } from '../middlewares/useApiKey.middleware.js'

const UserRouter = express.Router()
UserRouter.post('/register', UserController.register)
UserRouter.post('/login', UserLoginValidation, handleValidationErrors, UserController.loginUser)
UserRouter.post('/auth/login', UserLoginValidation, handleValidationErrors, UserController.loginAdmin)
UserRouter.get('/user', requireApiKey, UserController.getUserById)
UserRouter.get('/users', requireApiKey, authenticationAdmin, UserController.getAllUsers)
UserRouter.put('/user/:id', requireApiKey, UserController.updateUser)
UserRouter.delete('/:id', requireApiKey, authenticationAdmin, UserController.deleteUser)
UserRouter.put('/password', UserController.resetPassword)

export default UserRouter