import foodModel from "../models/food.model.js";
import uploadFile from "../services/storage.service.js";
import {v4 as uuid} from 'uuid'

async function createFood(req, res){
    // console.log(req.file)

    const fileUploadResult = await uploadFile(req.file.buffer, uuid())

    console.log(fileUploadResult) ; 

}

export default createFood ; 