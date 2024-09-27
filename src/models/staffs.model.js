import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const StaffSchema = new mongoose.Schema(
  {
    staff_id: { type: ObjectId, refs: 'Users', required: true, unique: true },
    restaurant_id: { type: ObjectId, required: true },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now },
    deleted_at: { type: Date, default: null }
  },
  { timestamps: true }
)

const StaffModel = mongoose.model('Staffs', StaffSchema)

export default StaffModel
