import { BadRequestError } from '../errors/badRequest.error.js'
import UserModel from '../models/users.model.js'
import { createApiKey } from '../middlewares/useApiKey.middleware.js'
import { createHash, checkPassword } from '../middlewares/usePassword.middleware.js'
import { Types } from 'mongoose'
import { USER_ROLE } from '../constants/user.constant.js'
import RestaurantModel from '../models/restaurant.model.js'
import StaffModel from '../models/staffs.model.js'

const register = async ({ username, password, phone, email, name }) => {
  if (await UserModel.findOne({ username })) {
    throw new BadRequestError('Account existed')
  }
  if (await UserModel.findOne({ email })) {
    throw new BadRequestError('Email existed')
  }
  if (await UserModel.findOne({ phone })) {
    throw new BadRequestError('Phone existed')
  }
  const salt = createApiKey(Math.random().toString(36).substring(2))
  console.log('salt', salt)
  const user = new UserModel({
    _id: new Types.ObjectId(),
    username,
    password: await createHash(password + salt),
    phone,
    email,
    name,
    role: USER_ROLE.USER,
    salt
  })
  return await user.save()
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

const getAllUsers = async (id, page = 1, size = 5) => {
  const owner = await RestaurantModel.find({ user_id: id, deleted_at: null })
  const staffs = await StaffModel.aggregate([
    {
      $match: {
        deleted_at: null,
        restaurant_id: { $in: await RestaurantModel.find({ user_id: id, deleted_at: null }).distinct('_id') }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'staff_id',
        foreignField: '_id',
        as: 'staff'
      }
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restaurant_id',
        foreignField: '_id',
        as: 'restaurant'
      }
    },
    {
      $unwind: '$staff'
    },
    {
      $unwind: '$restaurant'
    },
    {
      $skip: Number(page - 1) * Number(size)
    },
    {
      $limit: Number(size)
    },
    {
      $project: {
        _id: 1,
        staff: '$staff',
        restaurant: '$restaurant'
      }
    }
  ]).exec()
  const count = await StaffModel.countDocuments({
    deleted_at: null,
    restaurant_id: { $in: await RestaurantModel.find({ user_id: id, deleted_at: null }).distinct('_id') }
  }).exec()
  return {
    data: staffs,
    info: {
      total: count,
      page,
      size,
      number_of_pages: Math.ceil(count / size)
    }
  }
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
const resetPassword = async (code, newPassword) => {
  jwt.verify(code, 'secret', async (err, decoded) => {
    if (err || !decoded) {
      throw new BadRequestError('Invalid access')
    } else {
      const result = await this.checkKey(decoded.data)
      if (result.length === 0) {
        throw new NotFoundError('User not found')
      }

      const hashedPassword = createHash(newPassword + result[0].salt)

      return await UserModel.findByIdAndUpdate(result[0]._id, { password: hashedPassword, updated_at: Date.now() })
    }
  })
}

export const UserService = {
  register,
  login,
  adminLogin,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  resetPassword,
}