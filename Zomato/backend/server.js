// Start Server 
import dotenv from "dotenv"
dotenv.config() ; 

import chalk from "chalk"
import app from "./src/app.js"
import connectDB from "./src/db/db.js"

connectDB() ; 

console.log("Loaded PUBLIC:", process.env.IMAGEKIT_PUBLIC_KEY);
console.log("Loaded PRIVATE:", process.env.IMAGEKIT_PRIVATE_KEY?.slice(0, 10) + "..."); 
console.log("Loaded URL:", process.env.IMAGEKIT_URL_ENDPOINT);


const PORT = process.env.PORT || 3000 ; 

app.listen(PORT, () => {
    console.log(chalk.blue.bold(`Server running on http://localhost:${PORT}`))
})