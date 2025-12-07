// Create server 

import express from 'express' 
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"
import authRoutes from './routes/auth.routes.js'

dotenv.config() ; 
const app = express() ;

// middlewares 

app.use(cookieParser())
app.use(express.json())

app.get("/", (req, res) => {
    console.log("Hello world")
})

app.use('/api/auth', authRoutes)

export default app ; 