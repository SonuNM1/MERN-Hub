import foodModel from "../models/food.model.js";
import uploadFile from "../services/storage.service.js";
import { v4 as uuid } from "uuid";

async function createFood(req, res) {
  try {

    if(!req.file){
        return res.status(400).json({
            success: false, 
            message: "No media file provided"
        })
    }

    // Multer puts the binary file (raw bytes) inside: req.file.buffer. This buffer = the actual image/video file in memory 

    // uuid() - generates a unique file name. Because using the original file name can cause conflicts like: "image.png" uploaded by two users at same time -> overwrite. Same name, duplicate uploads. UUID ensures every upload always has a unique name 

    const uploadResult = await uploadFile(req.file.buffer, uuid());

    const foodItem = await foodModel.create({
        name: req.body.name, 
        description: req.body.description, 
        video: uploadResult.url, 
        foodPartner: req.foodPartner._id
    })

    return res.status(201).json({
        success: true, 
        message: "Food created successfully", 
        food: foodItem 
    })
  } catch (error) {
    console.log("Create food error: ", error) ; 

    return res.status(500).json({
        success: false, 
        message: "Internal Server Error", 
        error: error.message
    })
  }
}

export default createFood;
