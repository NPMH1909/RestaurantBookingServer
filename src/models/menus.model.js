import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Dish', 'Beverage', 'Dessert']
    },
    description: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurants' }
  },
  { timestamps: true }
)

const MenuItem = mongoose.model('Menus', menuItemSchema)
export default MenuItem
