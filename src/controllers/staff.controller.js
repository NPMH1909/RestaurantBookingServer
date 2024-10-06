import { HttpStatusCode } from "axios"
import { Response } from "../dtos/response.js"
import { StaffService } from "../services/staff.service.js"

const registerStaff = async(req, res) => {
    try {
        const {restaurant_id} = req.params
        const result = await StaffService.registerStaff(restaurant_id, req.body)
        return new Response(HttpStatusCode.Created, 'Thanh cong', result).responseHandler(res)
    } catch (error) {
        return new Response(error.status|| HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}
const getAllStaffByRestaurantId = async(req, res) => {
    try {
        const {restaurant_id} = req.params
        const result = await StaffService.getAllStaffByRestaurantId(restaurant_id)
        return new Response(HttpStatusCode.Created, 'Thanh cong', result).responseHandler(res)
    } catch (error) {
        return new Response(error.status|| HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}

const deleteStaff = async(req, res) => {
    try {
        const {id} = req.params
        const result = await StaffService.deleteStaff(id)
        return new Response(HttpStatusCode.Created, 'Thanh cong', result).responseHandler(res)
    } catch (error) {
        return new Response(error.status|| HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}
export const StaffController = {
registerStaff,
getAllStaffByRestaurantId,
deleteStaff
}