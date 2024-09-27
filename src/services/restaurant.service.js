import mongoose,{ Types } from "mongoose"
import RestaurantModel from "../models/restaurant.model"
import MenuItem from '../models/menus.model.js'
import { NotFoundError } from "../errors/notFound.error"
import TableModel from '../models/tables.model'
import { ConflictError } from '../errors/conflict.error.js'


const getAllRestaurant = async (page = 1, size = 5, field, sort) => {
    const restaurants = await RestaurantModel.aggregate([
      { $match: { deleted_at: null } },
      { $skip: (page - 1) * size },
      { $limit: size },
      { $sort: { [field]: Number(sort) } },
      {
        $project: {
          created_at: 0,
          updated_at: 0,
          deleted_at: 0
        }
      }
    ])
    const total = await RestaurantModel.countDocuments({ deleted_at: null })
    return { data: restaurants, info: { total, page, size, number_of_pages: Math.ceil(total / size) } }
  }
  const getAllRestaurantByUserId = async (id, page = 1, size = 5) => {
    const restaurants = await RestaurantModel.aggregate([
      { $match: { deleted_at: null, user_id: id } },
      { $skip: (page - 1) * size },
      { $limit: size },
      {
        $project: {
          created_at: 0,
          updated_at: 0,
          deleted_at: 0
        }
      }
    ])
    const total = await RestaurantModel.countDocuments({ deleted_at: null, user_id: id })
    return { data: restaurants, info: { total, page, size, number_of_pages: Math.ceil(total / size) } }
  }
  const getRestaurantById = async (id) => {
    const restaurant = await RestaurantModel.aggregate([
      { $match: { _id: Types.ObjectId.createFromHexString(id), deleted_at: null } },
      { $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' } },
      {
        $project: {
          user: '$user.name',
          name: 1,
          address: 1,
          openTime: 1,
          closeTime: 1,
          description: 1,
          image_url: 1,
          slider1: 1,
          slider2: 1,
          slider3: 1,
          slider4: 1,
          public_id_avatar: 1,
          public_id_slider1: 1,
          public_id_slider2: 1,
          public_id_slider3: 1,
          public_id_slider4: 1,
          price_per_table: 1
        }
      }
    ]).exec()
    const tables = await TableModel.aggregate([
      { $match: { restaurant_id: Types.ObjectId.createFromHexString(id), deleted_at: null } },
      {
        $project: {
          created_at: 0,
          updated_at: 0,
          deleted_at: 0
        }
      },
      {
        $project: {
          number_of_tables: 1,
          people_per_table: 1
        }
      }
    ]).exec()
    const totalPeople = tables.reduce((total, table) => total + table.people_per_table * table.number_of_tables, 0)
    const menus = await MenuItem.find({ restaurant_id: id, deleted_at: null }).exec()
    return restaurant.length > 0
      ? {
          restaurant: restaurant[0],
          totalPeople,
          menus
        }
      : null
  }
  const getRestaurantIdAndNameByUserId = (id) => {
    return RestaurantModel.find({ user_id: id, deleted_at: null }).select('_id name').exec()
  }

  const createRestaurant = async (
    id,
    {
      name,
      address,
      openTime,
      closeTime,
      description,
      image_url,
      slider1,
      slider2,
      slider3,
      slider4,
      public_id_avatar,
      public_id_slider1,
      public_id_slider2,
      public_id_slider3,
      public_id_slider4,
      price_per_table
    }
  ) => {
    const existingRestaurant = await RestaurantModel.findOne({
      name,
      address,
      deleted_at: null
    })
  
    if (existingRestaurant) {
      throw new NotFoundError('Nhà hàng đã tồn tại')
    }
    const newRestaurant = new RestaurantModel({
      _id: new mongoose.Types.ObjectId(),
      name,
      address,
      openTime,
      closeTime,
      description,
      image_url,
      slider1,
      slider2,
      slider3,
      slider4,
      public_id_avatar,
      public_id_slider1,
      public_id_slider2,
      public_id_slider3,
      public_id_slider4,
      price_per_table,
      user_id: id
    })
    return await newRestaurant.save()
  }
  
  const updateRestaurant = async (
    id,
    {
      name,
      address,
      openTime,
      closeTime,
      description,
      image_url,
      slider1,
      slider2,
      slider3,
      slider4,
      public_id_avatar,
      public_id_slider1,
      public_id_slider2,
      public_id_slider3,
      public_id_slider4,
      price_per_table
    }
  ) => {
    const existingRestaurant = await RestaurantModel.findOne({ name, address }).exec()
    if (existingRestaurant && existingRestaurant._id.toString() !== id) {
      throw new ConflictError('Nhà hàng đã tồn tại')
    }
    const restaurant = await getRestaurantById(id)
  
    if (!restaurant || restaurant.deleted_at) {
      throw new NotFoundError('Nhà hàng không tìm thấy')
    }
  
    const result = await RestaurantModel.updateOne(
      { _id: Types.ObjectId.createFromHexString(id) },
      {
        name,
        address,
        openTime,
        closeTime,
        description,
        image_url,
        slider1,
        slider2,
        slider3,
        slider4,
        public_id_avatar,
        public_id_slider1,
        public_id_slider2,
        public_id_slider3,
        public_id_slider4,
        price_per_table,
        updated_at: Date.now()
      }
    )
    if (result.modifiedCount === 0) {
      throw new NotFoundError('Nhà hàng không được cập nhật')
    }
    return await RestaurantModel.findById(id)
  }
  
  const deleteRestaurant = async (id) => {
    const restaurant = await RestaurantModel.findOne({ _id: id, deleted_at: null }).orFail(
      new NotFoundError('Nhà hàng không tìm thấy')
    )
    return await RestaurantModel.updateOne({ _id: id, deleted_at: null }, { deleted_at: new Date() })
  }

  const getAllRestaurantByFilterAndSort = async (upper, lower, sort, page = 1) => {
    let restaurants, total
    if (sort === 'new') {
      restaurants = await RestaurantModel.aggregate([
        {
          $match: {
            deleted_at: null,
            price_per_table: { $gte: Number(lower), $lte: Number(upper) }
          }
        },
        {
          $sort: { created_at: -1 }
        },
        {
          $skip: (page - 1) * 8
        },
        {
          $limit: 8
        },
        {
          $project: {
            created_at: 0,
            updated_at: 0,
            deleted_at: 0
          }
        }
      ]).exec()
      total = await RestaurantModel.countDocuments({
        deleted_at: null,
        price_per_table: { $gte: Number(lower), $lte: Number(upper) }
      }).exec()
    } else if (sort === 'old') {
      restaurants = await RestaurantModel.aggregate([
        {
          $match: {
            deleted_at: null,
            price_per_table: { $gte: Number(lower), $lte: Number(upper) }
          }
        },
        {
          $sort: { create_aAt: 1 }
        },
        {
          $skip: (page - 1) * 8
        },
        {
          $limit: 8
        },
        {
          $project: {
            created_at: 0,
            updated_at: 0,
            deleted_at: 0
          }
        }
      ]).exec()
      total = await RestaurantModel.countDocuments({
        deleted_at: null,
        price_per_table: { $gte: Number(lower), $lte: Number(upper) }
      }).exec()
    } else if (sort === 'A->Z') {
      restaurants = await RestaurantModel.aggregate([
        {
          $match: {
            deleted_at: null,
            price_per_table: { $gte: Number(lower), $lte: Number(upper) }
          }
        },
        {
          $sort: { name: 1 }
        },
        {
          $skip: (page - 1) * 8
        },
        {
          $limit: 8
        },
        {
          $project: {
            created_at: 0,
            updated_at: 0,
            deleted_at: 0
          }
        }
      ]).exec()
      total = await RestaurantModel.countDocuments({
        deleted_at: null,
        price_per_table: { $gte: Number(lower), $lte: Number(upper) }
      }).exec()
    } else if (sort === 'Z->A') {
      restaurants = await RestaurantModel.aggregate([
        {
          $match: {
            deleted_at: null,
            price_per_table: { $gte: Number(lower), $lte: Number(upper) }
          }
        },
        {
          $sort: { name: -1 }
        },
        {
          $skip: (page - 1) * 8
        },
        {
          $limit: 8
        },
        {
          $project: {
            created_at: 0,
            updated_at: 0,
            deleted_at: 0
          }
        }
      ]).exec()
      total = await RestaurantModel.countDocuments({
        deleted_at: null,
        price_per_table: { $gte: Number(lower), $lte: Number(upper) }
      }).exec()
    } else if (sort === 'price-asc') {
      restaurants = await RestaurantModel.aggregate([
        {
          $match: {
            deleted_at: null,
            price_per_table: { $gte: Number(lower), $lte: Number(upper) }
          }
        },
        {
          $sort: { price_per_table: 1 }
        },
        {
          $skip: (page - 1) * 8
        },
        {
          $limit: 8
        },
        {
          $project: {
            created_at: 0,
            updated_at: 0,
            deleted_at: 0
          }
        }
      ]).exec()
      total = await RestaurantModel.countDocuments({
        deleted_at: null,
        price_per_table: { $gte: Number(lower), $lte: Number(upper) }
      }).exec()
    } else if (sort === 'price-desc') {
      restaurants = await RestaurantModel.aggregate([
        {
          $match: {
            deleted_at: null,
            price_per_table: { $gte: Number(lower), $lte: Number(upper) }
          }
        },
        {
          $sort: { price_per_table: -1 }
        },
        {
          $skip: (page - 1) * 8
        },
        {
          $limit: 8
        },
        {
          $project: {
            created_at: 0,
            updated_at: 0,
            deleted_at: 0
          }
        }
      ]).exec()
      total = await RestaurantModel.countDocuments({
        deleted_at: null,
        price_per_table: { $gte: Number(lower), $lte: Number(upper) }
      }).exec()
    }
    return { data: restaurants, info: { total, page, size: 8, number_of_pages: Math.ceil(total / 8) } }
  }
  const findRestaurantsByAnyField = async (searchTerm, page = 1, size = 5) => {
    const restaurants = await RestaurantModel.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { address: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } }
          ],
          deleted_at: null
        }
      },
      { $skip: (page - 1) * size },
      { $limit: size },
      {
        $project: {
          created_at: 0,
          updated_at: 0,
          deleted_at: 0
        }
      }
    ])
    const total = await RestaurantModel.countDocuments({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { address: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ],
      deleted_at: null
    })
    return { data: restaurants, info: { total, page, size, number_of_pages: Math.ceil(total / size) } }
  }
  export const RestaurantService = {
    getAllRestaurant,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getAllRestaurantByFilterAndSort,
    getRestaurantIdAndNameByUserId,
    getAllRestaurantByUserId,
    findRestaurantsByAnyField,
  }