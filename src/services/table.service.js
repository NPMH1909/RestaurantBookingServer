import mongoose, { Types } from "mongoose"
import TableModel from "../models/tables.model.js"
import { NotFoundError } from "../errors/notFound.error.js"
import RestaurantModel from "../models/restaurants.model.js"

  const createTable = async (restaurant_id,{ name, people_per_table}) => {
    const restaurant = await RestaurantModel.find({
      _id: restaurant_id,
      deleted_at: null
    }).orFail(new NotFoundError('Nhà hàng không tìm thấy'))
    const newTable = new TableModel({
      name,
      people_per_table,
      restaurant_id
    })
    return await newTable.save()
  }
  
  const updateTable = async (id, { name, people_per_table, restaurant_id }) => {
    return await TableModel.findByIdAndUpdate(
      Types.ObjectId.createFromHexString(id),
      {
        $set: {
          name,
          people_per_table,
          restaurant_id,
        }
      },
      { new: true }
    )
  }

  const deleteTable = async (id) => {
    const table = await TableModel.find({ _id: id, deleted_at: null }).orFail(new NotFoundError('Không tìm thấy bàn'))
    return await TableModel.findByIdAndUpdate(Types.ObjectId.createFromHexString(id), { deleted_at: Date.now() })
  }
  
  const findTablesByAnyField = async (searchTerm, page, size) => {
    const isObjectId = mongoose.Types.ObjectId.isValid(searchTerm)
  
    const query = {
      $or: [
        { _id: isObjectId ? Types.ObjectId.searchTerm : null },
        { number_of_tables: isNaN(searchTerm) ? null : searchTerm },
        { people_per_table: isNaN(searchTerm) ? null : searchTerm },
        { restaurant_id: isObjectId ? Types.ObjectId.searchTerm : null }
      ]
    }
  
    const tables = await TableModel.find(query)
      .skip((page - 1) * size)
      .limit(size)
      .exec()
    const count = await TableModel.countDocuments(query)
    return { data: tables, info: { total: count, page, size, number_of_pages: Math.ceil(count / size) } }
  }
  
  const getAllTableByRestaurantId = async (restaurant_id) => {
      return await TableModel.find({restaurant_id})
  }
  export const TableService = {
    createTable,
    updateTable,
    deleteTable,
    findTablesByAnyField,
    getAllTableByRestaurantId
  }
  