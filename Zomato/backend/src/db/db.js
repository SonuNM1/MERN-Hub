import mongoose from "mongoose";
import chalk from "chalk";

async function connectDB() {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        
        console.log(
            chalk.yellow.bold(`MongoDB Connected Successfully!`) + 
            chalk.white(`
                Host        :${conn.connection.host}
                Port        :${conn.connection.port}
                DB Name     :${conn.connection.name}
                State       :${conn.connection.readyState === 1 ? "Connected": "Not Connected"}
                `)
        )
    }catch(error){
        console.log(chalk.red.bold("MongoDB Connect Error: ", error)) ; 
    }
}

export default connectDB ;  