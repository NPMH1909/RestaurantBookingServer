import express from 'express'
import { StaffController } from '../controllers/staff.controller.js'
const StaffRouter = express.Router()

StaffRouter.put('/delete/:id', StaffController.deleteStaff)

export default StaffRouter
