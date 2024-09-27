import express from "express"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import { DATABASE_CONFIG } from "./src/configs/database.config.js"
import bodyParser from "body-parser"
import cors from "cors"
import route from './src/routes/index.route.js'

dotenv.config()
const port = process.env.PORT || 3000
const app = express()
app.use(bodyParser.json())
app.use(
    cors({
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true
    })
  )

route(app)
const DB_CONNECTION_STR = DATABASE_CONFIG.MONGO_DATABASE
const connect = async () => {
    try {
        await mongoose.connect(DB_CONNECTION_STR)
        console.log("Start connecting")
        app.listen(port,()=>{
            console.log(`Listening at port ${port}`)
        })
    } catch (error) {
        console.log(`error connect to database with error ${error.message}`)
    }
}
connect()