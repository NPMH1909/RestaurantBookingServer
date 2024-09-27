import { HttpStatusCode } from "axios"
import { UserService } from "../services/user.service.js"
import { Response } from "../dtos/response.js"
import { ValidateInput } from "../utils/ValidateInput.js"
import { BadRequestError } from "../errors/badRequest.error.js"

const register = async (req, res, next)=>{
  try {
    if (ValidateInput(...Object.values(req.body))) {
      throw new BadRequestError('Tài khoản là bắt buộc');
    }
    const result = await UserService.register(req.body)
    next(new Response(HttpStatusCode.Created,'Đăng kí thành công', result).responseHandler(res))
  } catch (error) {
    next (new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const loginUser = async (req, res, next) => {
  try {
    // #swagger.tags=['User']
    const result = await UserService.login(req.body)
    return new Response(HttpStatusCode.Ok, 'Đăng nhập thành công', result).responseHandler(res)
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}
const loginAdmin = async (req, res, next) => {
  try {
    const result = await UserService.adminLogin(req.body)
    next(new Response(HttpStatusCode.Ok, 'Đăng nhập thành công', result).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.user.id)
    if (!user) {
      throw new BadRequestError('Không thấy tài khoản')
    }
    next(new Response(HttpStatusCode.Ok, 'Đã tìm thấy tài khoản', user).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}
const getAllUsers = async (req, res, next) => {
  try {
    const { page, size } = req.query
    const users = await UserService.getAllUsers(req.user.id, Number(page) || 1, Number(size) || 5)
    // await LogService.createLog(req.user.id, 'Xem danh sách nhân viên', HttpStatusCode.Ok)
    next(new Response(HttpStatusCode.Ok, 'Đã tìm thấy tài khoản', users.data, users.info).responseHandler(res))
  } catch (error) {
    await LogService.createLog(
      req.user.id,
      'Xem danh sách nhân viên',
      error.statusCode || HttpStatusCode.InternalServerError
    )
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await UserService.updateUser(id, req.body)
    await LogService.createLog(req.user.id, 'Cập nhật nhân viên', HttpStatusCode.Ok)
    next(new Response(HttpStatusCode.Ok, 'Cập nhật tài khoản thành công', user).responseHandler(res))
  } catch (error) {
    await LogService.createLog(
      req.user.id,
      'Cập nhật nhân viên',
      error.statusCode || HttpStatusCode.InternalServerError
    )
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await UserService.deleteUser(id)
    if (!user) {
      throw new BadRequestError('Không thấy tài khoản')
    }
    await LogService.createLog(req.user.id, 'Xóa nhân viên', HttpStatusCode.Ok)
    next(new Response(HttpStatusCode.Ok, 'Xóa tài khoản thành công', null).responseHandler(res))
  } catch (error) {
    await LogService.createLog(req.user.id, 'Xóa nhân viên', error.statusCode || HttpStatusCode.InternalServerError)
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const { code, newPassword } = req.body
    const result = await UserService.resetPassword(code, newPassword)
    next(new Response(HttpStatusCode.Ok, 'Đổi mật khẩu thành công', result).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

export const UserController = {
    register,
    loginUser,
    loginAdmin,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    resetPassword,
}