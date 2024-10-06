import mongoose from 'mongoose'
import { USER_ROLE } from '../constants/user.constant.js'
import { ConflictError } from '../errors/conflict.error.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { createApiKey } from '../middlewares/useApiKey.middleware.js'
import { createHash } from '../middlewares/usePassword.middleware.js'
import RestaurantModel from '../models/restaurants.model.js'
import StaffModel from '../models/staffs.model.js'
import UserModel from '../models/users.model.js'

const registerStaff = async( restaurant_id, {username, phone, email, password, name}) => {
  await RestaurantModel.findById(restaurant_id).orFail(new NotFoundError('Nhà hàng không tồn tại'))
  const existingUser = await UserModel.findOne({$or:[{username}, {phone} , {email}]})
  if(existingUser){
    throw new ConflictError('Tài khoản đã tồn tại')
  }
  const salt = createApiKey(Math.random().toString(36).substring(2))
  const newUser = new UserModel({
    username,
    phone,
    name,
    email,
    salt, 
    role: USER_ROLE.STAFF,
    password: await createHash(password + salt)
  })
  const newStaff = new StaffModel({restaurant_id, staff_id: newUser._id})
  await newUser.save()
  return await newStaff.save()
}

const getAllStaffByRestaurantId = async(restaurant_id) => {
  restaurant_id = mongoose.Types.ObjectId.createFromHexString(restaurant_id)
  return await StaffModel.aggregate([
    {
      $match: {restaurant_id,
         deleted_at: null}
    },
    {
      $lookup:{
        from: 'users',
        localField: 'staff_id',
        foreignField: '_id',
        as:'staff'
      }
    },
    {
      $unwind: '$staff'
    },
    {
      $project: {
        _id: 1,
        restaurant_id: 1,
        'staff.name': 1,
        'staff.email': 1,
        'staff.phone': 1,
        created_at: 1,
        updated_at: 1
      }
    }
  ])

}
const deleteStaff = async(id) => {
  const staff = await StaffModel.findByIdAndUpdate(id, {deleted_at: new Date()})
  
  console.log("id", staff.staff_id)
  return await UserModel.findByIdAndUpdate(staff.staff_id,{role: USER_ROLE.USER},{new: true})
}
export const StaffService = {
  getAllStaffByRestaurantId,
  registerStaff,
  deleteStaff,
}
