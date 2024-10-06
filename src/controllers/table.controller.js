import { HttpStatusCode } from "axios"
import { Response } from "../dtos/response.js"
import { TableService } from "../services/table.service.js"

const getAllTable = async (req, res, next) => {
    // #swagger.tags=['Table']
    try {
      const { page, size } = req.query
      const data = await TableService.getAllTable(Number(page) || 1, Number(size) || 5)
      next(new Response(HttpStatusCode.Ok, 'Thành Công', data.data, data.info).responseHandler(res))
    } catch (error) {
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
    }
  }
  const getAllTableByUserId = async (req, res, next) => {
    // #swagger.tags=['Table']
    try {
      const { page, size } = req.query
      const data = await TableService.getAllTableByUserId(req.user.id, Number(page) || 1, Number(size) || 5)
      next(new Response(HttpStatusCode.Ok, 'Thành Công', data.data, data.info).responseHandler(res))
    } catch (error) {
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
    }
  }
  const getTableById = async (req, res, next) => {
    // #swagger.tags=['Table']
    try {
      const id = req.params.id
      const data = await TableService.getTableById(id)
      next(new Response(HttpStatusCode.Ok, 'Thành Công', data).responseHandler(res))
    } catch (error) {
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
    }
  }
  
  const createTable = async (req, res, next) => {
    try {
      const {restaurant_id} = req.params
      const result = await TableService.createTable(restaurant_id, req.body)
      next(new Response(HttpStatusCode.Created, 'Thành Công', result).responseHandler(res))
    } catch (error) {
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, error).responseHandler(res))
    }
  }
  
  const updateTable = async (req, res, next) => {
    // #swagger.tags=['Table']
    // #swagger.security = [{ "Bearer": [] }]
    try {
      const result = await TableService.updateTable(req.params.id, req.body)
      await LogService.createLog(req.user.id, 'Cập nhật bàn ' + req.params.id)
      next(new Response(HttpStatusCode.Ok, 'Thành Công', result).responseHandler(res))
    } catch (error) {
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
    }
  }
  
  const deleteTable = async (req, res, next) => {
    // #swagger.tags=['Table']
    try {
      const result = await TableService.deleteTable(req.params.id)
      await LogService.createLog(req.user.id, 'Xóa bàn ' + req.params.id)
      next(new Response(HttpStatusCode.Ok, 'Thành Công', result).responseHandler(res))
    } catch (error) {
      await LogService.createLog(
        req.user.id,
        'Xóa bàn ' + req.params.id,
        error.statusCode || HttpStatusCode.InternalServerError
      )
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
    }
  }
  const findTableByAnyField = async (req, res, next) => {
    try {
      const { searchTerm } = req.body
      const { page, size } = req.query
      const result = await TableService.findTablesByAnyField(searchTerm, Number(page) || 1, Number(size) || 5)
      next(new Response(HttpStatusCode.Ok, 'Đã tìm thấy bàn', result.data, result.info).responseHandler(res))
    } catch (error) {
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
    }
  }
  
  const getAllTableByRestaurantId = async(req, res, next) => {
    try {
      const {restaurant_id} = req.params
      const result = await TableService.getAllTableByRestaurantId(restaurant_id)
      next(new Response(HttpStatusCode.Ok, 'Thành Công', result).responseHandler(res))
    } catch (error) {
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
    }
  }
  export const TableController = {
    getAllTable,
    getTableById,
    createTable,
    updateTable,
    deleteTable,
    findTableByAnyField,
    getAllTableByUserId,
    getAllTableByRestaurantId
  }
  