import { MAIL_CONFIG } from "../configs/mail.config.js"
import { NotFoundError } from "../errors/notFound.error.js"
import { createApiKey } from "../middlewares/useApiKey.middleware.js"
import userModel from "../models/users.model.js"
import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    port: 465,
    host: MAIL_CONFIG.SMTP_HOST,
    auth: {
      user: MAIL_CONFIG.GOOGLE_GMAIL,
      pass: MAIL_CONFIG.GOOGLE_KEY
    },
    secure: true
  })
  const sendMail = ({ to, subject, html }) => {
    const mailData = {
      from: 'Mindx Restaurant',
      to,
      subject,
      html
    }
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        return err
      } else {
        return info.messageId
      }
    })
  }
  
const sendResetPasswordMail = async (to) => {
    const user = await userModel.findOne({ email: to }).orFail(new NotFoundError('User not found'))
    const code = createApiKey(Math.random().toString(36).substring(2))
    user.resetPasswordToken = code
    await user.save();

    const subject = 'Mail reset mật khẩu của bạn'
    const html = `<h1>Reset mật khẩu của bạn</h1><p>Nhấp vào <a href="http://localhost:3000/reset-password?token=${code}">đây</a> để đặt lại mật khẩu của bạn.</p>`;
    transporter.sendMail({ to, subject, html }, (err, info) => {
      if (err) {
        throw err
      } else {
        return info.messageId
      }
    })
  }

  const sendConfirmationEmail = (result) => {
    const subject = 'Xác nhận đơn hàng'
    const html =
      `<p>Đơn hàng của bạn đã được xác nhận</p>
      <p>Mã đơn hàng: ${result[0].orderCode}</p>
      <p>Ngày nhận bàn: ${Date(result[0].checkin).slice(0, 11)}</p>
      <p>Thời gian nhận bàn: ${Date(result[0].checkin).slice(11, 16)}</p>
      <p>Địa chỉ nhà hàng: ${result[0].restaurant.address}</p>
      <p>Địa chỉ email: ${result[0].email}</p>
      <p>Số điện thoại: ${result[0].phone_number}</p>
      <p>Người nhận bàn: ${result[0].name}</p>
      <p>Số người: ${result[0].total_people}</p>
      <p>Phương thức thanh toán: ${result[0].payment}</p>
      <p>Menu: 
      ` +
      result[0].list_menu
        .map((item) => `<p>${item.name} - ${Number(item.price).toFixed(0)} đ - ${item.quantity} - ${item.unit} </p>`)
        .join('') +
      `
      </p>
      <p>Tổng tiền: ${Number(result[0].total).toFixed(0).toLocaleString('vi-VN')} đ</p>
      `
    transporter.sendMail({ to: result[0].email, subject, html }, (err, info) => {
      if (err) {
        throw err
      } else {
        return info.messageId
      }
    })
  }

  export const MailService = { sendMail, sendResetPasswordMail, sendConfirmationEmail }

