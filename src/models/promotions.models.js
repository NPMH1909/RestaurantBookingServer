import mongoose, { Schema, Types } from "mongoose";

const PromotionSchema = new mongoose.Schema({
    descripton: { type: String, required: true },
    discount: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    is_active: { type: Boolean, require: true, default: false},
    user_id: { type: mongoose.Types.ObjectId, ref: 'Restaurants', required: true },
    deleted_at: {type: Date, default: false}
},
    { timestamps: true })

const PromotionModel = mongoose.model('Promotions', PromotionSchema)
export default PromotionModel