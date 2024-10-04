import { HttpStatusCode } from "axios"
import { Response } from "../dtos/response.js"
import { BadRequestError } from "../errors/badRequest.error.js"
import { RestaurantService } from "../services/restaurant.service.js"
import { CommonUtils } from "../utils/common.util.js"

const getAllRestaurant = async (req, res, next) => {
    // #swagger.tags=['Restaurant']
    try {
      let data
      const { upper, lower, sort, page, size, field } = req.query
      if (size) {
        const { upper, lower, sort, page } = req.query
        data = await RestaurantService.getAllRestaurant(
          Number(page) || 1,
          Number(size) || 5,
          Number(field),
          Number(sort) || -1
        )
      } else {
        data = await RestaurantService.getAllRestaurantByFilterAndSort(upper, lower, sort, Number(page) || 1)
      }
      next(new Response(HttpStatusCode.Ok, 'Thành Công', data.data, data.info).responseHandler(res))
    } catch (error) {
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
    }
  }

const getAllRestaurantByUserId = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    const { page, size } = req.query
    const data = await RestaurantService.getAllRestaurantByUserId(req.user.id, Number(page) || 1, Number(size) || 5)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data.data, data.info).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const getRestaurantById = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    const data = await RestaurantService.getRestaurantById(req.params.id)
    if (data === null) {
      next(new Response(HttpStatusCode.NotFound, 'Không tìm thấy nhà hàng', data).responseHandler(res))
    }
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const createRestaurant = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await RestaurantService.createRestaurant(req.user.id, req.body)
    next(new Response(HttpStatusCode.Created, 'Thành Công', result).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const updateRestaurant = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await RestaurantService.updateRestaurant(req.params.id, req.body)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', result).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const deleteRestaurant = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    const result = await RestaurantService.deleteRestaurant(req.params.id)
    next(new Response(HttpStatusCode.Accepted, 'Thành Công', result).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const getRestaurantIdAndNameByUserId = async (req, res, next) => {
    try {
      const result = await RestaurantService.getRestaurantIdAndNameByUserId(req.user.id)
      next(new Response(HttpStatusCode.Ok, 'Thành Công', result).responseHandler(res))
    } catch (error) {
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
    }
  }
  const findRestaurantByAnyField = async (req, res, next) => {
    // #swagger.tags=['Restaurant']
    try {
      const { page, size } = req.query
      const { searchTerm } = req.body
      if (!searchTerm) {
        throw new BadRequestError('Giá trị tìm kiếm là bắt buộc')
      }
      const result = await RestaurantService.findRestaurantsByAnyField(searchTerm, Number(page) || 1, Number(size) || 5)
      next(new Response(HttpStatusCode.Ok, 'Đã tìm thấy nhà hàng', result.data, result.info).responseHandler(res))
    } catch (error) {
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
    }
  }
  
  export const RestaurantController = {
    getAllRestaurant,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    findRestaurantByAnyField,
    getRestaurantIdAndNameByUserId,
    getAllRestaurantByUserId,
  }