import { HttpStatusCode } from 'axios'
import { BadRequestError } from '../errors/badRequest.error.js'
import {OrderService} from '../services/order.service.js'
import { CommonUtils } from '../utils/common.util.js'
import { Response } from '../dtos/response.js'

const getAllOrder = async (req, res, next) => {
  try {
    const { page, size } = req.query
    const data = await OrderService.getAllOrder(Number(page) || 1, Number(size) || 5)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data.data, data.info).resposeHandler(res))
  } catch (error) {
      next (new BadRequestError('Tạo đơn hàng thất bại'))
  }
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
const getAllOrderByStaffId = async (req, res, next) => {
  try {
    const { page, size } = req.query
    const data = await OrderService.getAllOrderByStaffId(req.user.id, Number(page) || 1, Number(size) || 5)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data.data, data.info).resposeHandler(res))
  } catch (error) {
    await LogService.createLog(
      req.user.id,
      'Xem danh sách đơn hàng',
      error.statusCode || HttpStatusCode.InternalServerError
    )
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
}
const getAllOrderByUserId = async (req, res, next) => {

  try {
    const { page, size } = req.query
    const data = await OrderService.getAllOrderByUserId(req.user.id, Number(page) || 1, Number(size) || 5)
    // await LogService.createLog(req.user.id, 'Xem danh sách đơn hàng', HttpStatusCode.Ok)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data.data, data.info).resposeHandler(res))
  } catch (error) {
    await LogService.createLog(
      req.user.id,
      'Xem danh sách đơn hàng',
      error.statusCode || HttpStatusCode.InternalServerError
    )
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
}
const getOrderById = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    const data = await OrderService.getOrderById(req.params.id)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
}
const confirmOrder = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    const data = await OrderService.confirmOrder(req.params.id)
    await LogService.createLog(req.user.id, 'Xác nhận đơn hàng', HttpStatusCode.Ok)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data).resposeHandler(res))
  } catch (error) {
    await LogService.createLog(req.user.id, 'Xác nhận đơn hàng', error.statusCode || HttpStatusCode.InternalServerError)
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
}

const payOrder = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    const paymentLinkRes = await OrderService.payOrder(req.body)
    await LogService.createLog(req.user.id, 'Thanh toán đơn hàng', HttpStatusCode.Ok)
    return res.json({
      error: 0,
      message: 'Thành Công',
      data: {
        bin: paymentLinkRes.bin,
        checkoutUrl: paymentLinkRes.checkoutUrl,
        accountNumber: paymentLinkRes.accountNumber,
        accountName: paymentLinkRes.accountName,
        amount: paymentLinkRes.amount,
        description: paymentLinkRes.description,
        orderCode: paymentLinkRes.orderCode,
        qrCode: paymentLinkRes.qrCode
      }
    })
  } catch (error) {
    await LogService.createLog(req.user.id, 'Thanh toán đơn hàng', -1)
    next(new Response(-1, error.message, null).resposeHandler(res))
  }
}
const createOrder = async (req, res, next) => {
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await OrderService.createOrder(req.user.id, req.body)
    next(new Response(HttpStatusCode.Created, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
}

const updateOrder = async (req, res, next) => {
  // #swagger.tags=['Order']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await OrderService.updateOrder(req.params.id, req.body)
    await LogService.createLog(req.user.id, 'Chỉnh sửa đơn hàng')
    next(new Response(HttpStatusCode.Ok, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    await LogService.createLog(
      req.user.id,
      'Thanh toán đơn hàng',
      error.statusCode || HttpStatusCode.InternalServerError
    )
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
}

const deleteOrder = async (req, res, next) => {
  try {
    const result = await OrderService.deleteOrder(req.params.id)
    await LogService.createLog(req.user.id, 'Xóa đơn hàng')
    next(new Response(HttpStatusCode.Ok, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    await LogService.createLog(req.user.id, 'Xóa đơn hàng', error.statusCode || HttpStatusCode.InternalServerError)
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
}


export const OrderController = {
  getAllOrder,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  confirmOrder,
  payOrder,
  getAllOrderByUserId,
  getAllOrderByStaffId
}
