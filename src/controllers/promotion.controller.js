import { HttpStatusCode } from "axios"
import { Response } from "../dtos/response"
import { PromotionService } from "../services/promotion.service"


const createPromotion = async(req, res)=>{
    try {
        const {id} = req.user.id
        const result = await PromotionService.createPromotion(id,req.body)
        return new Response(HttpStatusCode.Ok, 'Thành công', result).responseHandler(res)
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}

const updatePromotion = async(req, res)=>{
    try {
        const {id} = req.params
        const result = await PromotionService.updatePromotion(id,req.body)
        return new Response(HttpStatusCode.Ok, 'Thành công', result).responseHandler(res)
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}

const deletePromotion = async(req, res)=>{
    try {
        const {id} = req.params
        const result = await PromotionService.deletePromotion(id)
        return new Response(HttpStatusCode.Ok, 'Thành công', result).responseHandler(res)
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}

const getAllPromotion = async(req, res)=>{
    try {
        const {id} = req.user.id
        const result = await PromotionService.getAllPromotion(id)
        return new Response(HttpStatusCode.Ok, 'Thành công', result).responseHandler(res)
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}

const getPromotionById = async(req, res)=>{
    try {
        const {id} = req.params
        const result = await PromotionService.getPromotionById(id)
        return new Response(HttpStatusCode.Ok, 'Thành công', result).responseHandler(res)
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}


export const PromotioController = {
    createPromotion,
    updatePromotion,
    deletePromotion,
    getAllPromotion,
    getPromotionById,
}
