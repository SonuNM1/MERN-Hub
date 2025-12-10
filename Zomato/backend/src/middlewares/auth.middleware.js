import foodPartnerModel from "../models/foodpartner.model.js";
import jwt from "jsonwebtoken";
import chalk from "chalk"

async function authFoodPartnerMiddleware(req, res, next) {
  try {

    // read the token from cookies - the cookie we set during login was: res.cookie("token", token)

    const token = req.cookies.token;

    // if token is missing -> user is not logged in

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access! Please login first.",
      });
    }

    // verify token -> check if it is valid and not expired 

    const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET_KEY
    )

    console.log("Decoded: ", decoded)

    // fetch the actual user from the database. So middleware can attach user data to request 

    const foodPartner = await foodPartnerModel.findById(
        decoded.id
    )

    // If user was deleted but token still exists 

    if(!foodPartner){
      return res.status(401).json({
        message: "Invalid token! Account no longer exists."
      })
    }

    // attach user to request object, so routes can access it 

    req.foodPartner = foodPartner ; 

    next() ; 
  } catch (error) {
    console.log(chalk.red.bold("Middleware error: ", error))

    return res.status(401).json({
        message: "Something went wrong"
    })
  }
}

export default authFoodPartnerMiddleware;
