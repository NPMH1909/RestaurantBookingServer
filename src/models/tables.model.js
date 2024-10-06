import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId
const TableSchema = new Schema({
  name: { type: String, required: true },
  people_per_table: { type: Number, required: true },
  status: {type: String, required: true, default: 'EMPTY'},
  restaurant_id: { type: ObjectId, ref: 'Restaurants', required: true },
  deleted_at: { type: Date, default: null }
},{
  timestamps: true
})
const TableModel = mongoose.model('Tables', TableSchema)

export  default TableModel
