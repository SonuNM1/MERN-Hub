import express from "express"
import createFood from "../controllers/food.controller.js";
import authFoodPartnerMiddleware from "../middlewares/auth.middleware.js";
import multer from 'multer'

const router = express.Router() ; 

// uploading a file using multer.memoryStorage(). Multer puts the binary file (raw bytes) inside: req.file.buffer. This buffer = the actual image/video file in memory 

const upload = multer({
    storage: multer.memoryStorage()
})

// .single("video") -> expects one file in the form-data with key "video". Multer parses the request and puts the file inside "req.file". Other fields from form-data are available in "req.body"

router.post('/', authFoodPartnerMiddleware, upload.single("video"), createFood)

export default router ; 