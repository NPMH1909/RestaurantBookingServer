import { MAIL_CONFIG } from "../configs/mail.config.js"
import { NotFoundError } from "../errors/notFound.error.js"
import { createApiKey } from "../middlewares/apiKey.middleware.js"
import userModel from "../models/user.model.js"
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

  export const MailService = { sendMail, sendResetPasswordMail }
