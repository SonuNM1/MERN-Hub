import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true 
    }, 
    video: {
        type: String, // video will be file, but we will be storing the video url in the DB
        required: true  
    },
    description: {
        type: String 
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "foodpartner"
    }
})

const foodModel = mongoose.model("food", foodSchema)

export default foodModel ; 