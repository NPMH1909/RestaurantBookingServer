import PromotionModel from "../models/promotion.models"
import { ConflictError } from "../errors/conflict.error.js"
import { NotFoundError } from "../errors/notFound.error.js"
import { BadRequestError } from "../errors/badRequest.error.js"
const createPromotion = async (user_id, data) => {
    const { code } = data
    await PromotionModel.findOne({ user_id, code, deleted_at: null }).orFail(new ConflictError('Khuyến mãi đã tồn tại'))
    const newPromotion = new PromotionModel({ ...data, restaurant_id })
    return await newPromotion.save()
}

const updatePromotion = async (id, data) => {
    await PromotionModel.findOne({_id:id, deleted_at: null}).orFail(new NotFoundError('Không tìm thấy khuyến mãi'))
    return await PromotionModel.findByIdAndUpdate(id,{...data}, {new: true}).orFail(new BadRequestError('Không thể cập nhật'))
}

const deletePromotion = async (id) => {
    await PromotionModel.findById(id).orFail(new NotFoundError('Không tìm thấy khuyến mãi'))
    return await PromotionModel.findOneAndUpdate(id, {deleted_at: new Date()}).orFail(new BadRequestError('Không thể xóa khuyến mãi'))
}

const getAllPromotion = async (user_id) => {
    return await PromotionModel.find({user_id, deleted_at:null}).orFail(new NotFoundError('Không tìm thấy khuyến mãi'))
}

const getPromotionById = async(id) => {
    return await PromotionModel.findOne({_id:id, deleted_at:null}).orFail(new NotFoundError('Không tìm tháy khuyến mãi'))
}
export const PromotionService = {
    createPromotion,
    updatePromotion,
    deletePromotion,
    getAllPromotion,
    getPromotionById
}