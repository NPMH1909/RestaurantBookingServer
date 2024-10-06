import { HttpStatusCode } from "axios"
import { Response } from "../dtos/response.js"
import { BadRequestError } from "../errors/badRequest.error.js"
import { MailService } from "../services/mail.service.js"
import { UserService} from "../services/user.service.js"
const register = async (req, res, next)=>{
  try {
    const result = await UserService.register(req.body)
    next(new Response(HttpStatusCode.Created,'Đăng kí thành công', result).responseHandler(res))
  } catch (error) {
    next (new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}

const loginUser = async (req, res, next) => {
  try {
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

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await UserService.updateUser(id, req.body)
    next(new Response(HttpStatusCode.Ok, 'Cập nhật tài khoản thành công', user).responseHandler(res))
  } catch (error) {
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
    next(new Response(HttpStatusCode.Ok, 'Xóa tài khoản thành công', null).responseHandler(res))
  } catch (error) {
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
const sendResetPasswordEmail = async (req, res, next) => {
  try {
    const { to } = req.body

    if (!to) {
      throw new BadRequestError('Email là bắt buộc')
    }

    const result = await MailService.sendResetPasswordMail(to)
    next(new Response(HttpStatusCode.Ok, 'Gửi thành công', result).responseHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res))
  }
}
const changePassword = async(req, res)=>{
  try {
      const id = req.user.id
      const result = await UserService.changePassword(id,req.body)
      return new Response(HttpStatusCode.Ok, 'thah cong', result).responseHandler(res)
  } catch (error) {
      return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
  }
}
export const UserController = {
    register,
    loginUser,
    loginAdmin,
    getUserById,
    updateUser,
    deleteUser,
    resetPassword,
    sendResetPasswordEmail,
    changePassword,
}