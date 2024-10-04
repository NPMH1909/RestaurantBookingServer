import { HttpStatusCode } from 'axios'
import { Response } from '../dtos/response.js'
import { MenuService } from '../services/menu.service.js'
const createMenuItem = async (req, res, next) => {
  try {
    const newItem = await MenuService.createMenuItem(req.body)
    next(new Response(HttpStatusCode.Created, 'Menu đã được tạo', newItem).responseHandler(res))
  } catch (error) {
    await LogService.createLog(req.user.id, 'Tạo menu', error.statusCode || HttpStatusCode.InternalServerError)
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const getAllMenuItems = async (req, res, next) => {
  try {
    const { page, size } = req.query
    const items = await MenuService.getAllMenuItems(Number(page) || 1, Number(size) || 5)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', items.data, items.info).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}
const getAllMenuItemsByUserId = async (req, res, next) => {
  try {
    const { page, size } = req.query
    const items = await MenuService.getAllMenuItemsByUserId(req.user.id, Number(page) || 1, Number(size) || 5)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', items.data, items.info).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}
const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuService.getMenuItemById(req.params.id)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', item).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const updateMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuService.updateMenuItemById(req.params.id, req.body)
    next(new Response(HttpStatusCode.Ok, 'Menu đã được cập nhật', item).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const deleteMenuItemById = async (req, res, next) => {
  try {
    await MenuService.deleteMenuItemById(req.params.id)
    next(new Response(HttpStatusCode.Ok, 'Menu đã được xóa', null).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const findMenuByAnyField = async (req, res, next) => {
  try {
    const { searchTerm } = req.body
    const { page, size } = req.query
    const result = await MenuService.findMenuItemsByAnyField(searchTerm, page, size)
    next(new Response(HttpStatusCode.Ok, 'Đã tìm thấy bàn', result).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const countMenu = async (req, res, next) => {
  try {
    const result = await MenuService.countMenu()
    next(new Response(HttpStatusCode.Ok, 'Thành Công', result).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

export const MenuController = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItemById,
  deleteMenuItemById,
  findMenuByAnyField,
  countMenu,
  getAllMenuItemsByUserId
}
