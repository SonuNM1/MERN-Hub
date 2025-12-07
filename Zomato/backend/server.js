// Start Server 
import chalk from "chalk"
import app from "./src/app.js"
import connectDB from "./src/db/db.js"

connectDB() ; 

const PORT = process.env.PORT || 3000 ; 

app.listen(PORT, () => {
    console.log(chalk.blue.bold(`Server running on http://localhost:${PORT}`))
})