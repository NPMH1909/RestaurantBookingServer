import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, },
    email: { type: String, required: true, },
    name: { type: String, required: true },
    role: { type: String, required: true, },
    salt: { type: String, required: true },
    deleted_at: { type: Date, default: null }
},
    {
        timestamps: true,
    }
)

const UserModel = mongoose.model("User",UserSchema)
export  default UserModel