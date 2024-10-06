import { BadRequestError } from '../errors/badRequest.error.js'
import UserModel from '../models/users.model.js'
import { createApiKey } from '../middlewares/useApiKey.middleware.js'
import { createHash, checkPassword } from '../middlewares/usePassword.middleware.js'
import { USER_ROLE } from '../constants/user.constant.js'
import StaffModel from '../models/staffs.model.js'
import { NotFoundError } from '../errors/notFound.error.js'

const register = async(data) => {
  const {username, phone, email, password} = data
  const existingUser = await UserModel.findOne({
    $or: [{username},{phone},{email}]
  })
  if(existingUser){
    throw new ConflictError('Người dùng đã tồn tại')
  }
  const salt = createApiKey(Math.random().toString(36).substring(2))
  const newUser = new UserModel({...data, salt, password: await createHash(password + salt), role: USER_ROLE.USER })
  return await newUser.save()
}


const login = async ({ username, password }) => {
  const user = await UserModel.findOne({
    $and: [
      {
        $or: [{ username }, { email: username }, { phone: username }]
      },
      { deleted_at: null }
    ]
  }).orFail(() => {
    throw new BadRequestError('Username or password is incorrect')
  })
  const isPasswordValid = await checkPassword(password, user.salt, user.password)
  if (!isPasswordValid) {
    throw new BadRequestError('Username or password is incorrect')
  }
  if (user.salt === undefined) {
    throw new BadRequestError('Tài khoản đã bị khóa')
  }
  return createApiKey(user._id, user.role)
}

const adminLogin = async ({ username, password }) => {
  const user = await UserModel.findOne({
    $and: [{ $or: [{ username }, { email: username }, { phone: username }] }, { deleted_at: null }]
  }).orFail(() => {
    throw new BadRequestError('Username or password is incorrect')
  })
  const isPasswordValid = await checkPassword(password, user.salt, user.password)
  if (!isPasswordValid) {
    throw new BadRequestError('Invalid username or password')
  }

  if (user.role === USER_ROLE.ADMIN) {
    return {
      redirect_url: '/dashboard',
      token: createApiKey(user._id, user.role)
    }
  } else if (user.role === USER_ROLE.STAFF) {
    return {
      redirect_url: '/staff',
      token: createApiKey(user._id, user.role)
    }
  } else {
    throw new BadRequestError('Invalid role')
  }
}


const getUserById = async (id) => {
  return UserModel.findById(id, { _id: 1, name: 1, phone: 1, email: 1 }).orFail(() => {
    throw new NotFoundError('User not found')
  })
}


const updateUser = async (id, { name, restaurant_id }) => {
  const staff = await StaffModel.findByIdAndUpdate(id, { restaurant_id }).orFail(() => {
    throw new NotFoundError('User not found')
  })
  return await UserModel.findByIdAndUpdate(staff.staff_id, { name }).orFail(() => {
    throw new NotFoundError('User not found')
  })
}
const deleteUser = async (id) => {
  const staff = await StaffModel.findByIdAndUpdate(id, { deleted_at: Date.now() }).orFail(() => {
    throw new NotFoundError('User not found')
  })

  return await UserModel.findByIdAndUpdate(staff.staff_id, { deleted_at: Date.now() }).orFail(() => {
    throw new NotFoundError('User not found')
  })
}
const changePassword = async (id, { password, newPassword, retypeNewPassword }) => {
  const user = await UserModel.findById(id).orFail(new NotFoundError('Không tìm thấy user'))
  const isCheckPassword = await checkPassword(password, user.salt, user.password)
  if (!isCheckPassword) {
      throw new BadRequestError("Mật khẩu không chính xác")
  }
  if (newPassword !== retypeNewPassword) {
      throw new BadRequestError("Mật khẩu mới không trùng khớp")
  }
  const createNewPassword = await createHash(newPassword + user.salt)
  return await UserModel.findByIdAndUpdate(id, { password: createNewPassword }).orFail(() => {
      throw new NotFoundError('Không thể thay đổi mật khẩu')
  });
}

const resetPassword = async (token, newPassword, retypeNewPassword) => {
  try {
      jwt.verify(token, 'secretkey');
      const user = await UserModel.findOne({ resetPasswordToken: token }).orFail(new NotFoundError('Invalid token'));

      if (retypeNewPassword !== newPassword) {
          throw new BadRequestError('Mật khẩu mới không trùng khớp');
      }

      const hashedPassword = await createHash(newPassword + user.salt);
      return await UserModel.findByIdAndUpdate(user._id, {
          password: hashedPassword,
          resetPasswordToken: null, 
      });
  } catch (err) {
      throw new BadRequestError('Token đã hết hạn hoặc không hợp lệ');
  }
};


export const UserService = {
  register,
  login,
  adminLogin,
  getUserById,
  updateUser,
  deleteUser,
  resetPassword,
  changePassword,
}