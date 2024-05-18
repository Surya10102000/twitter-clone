import express from "express"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.routes.js"
import connectDB from "./db/connectMongoDB.js"
dotenv.config()

const app = express();
const PORT = process.env.PORT

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended : true}))

app.use("/api/auth",authRoutes);

app.listen(PORT, ()=>{
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})