import foodPartnerModel from "../models/foodpartner.model.js";
import jwt from "jsonwebtoken";
import chalk from "chalk";
import userModel from "../models/user.model.js";

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log("Decoded: ", decoded);

    // fetch the actual user from the database. So middleware can attach user data to request

    const foodPartner = await foodPartnerModel.findById(decoded.id);

    // If user was deleted but token still exists

    if (!foodPartner) {
      return res.status(401).json({
        message: "Invalid token! Account no longer exists.",
      });
    }

    // attach user to request object, so routes can access it

    req.foodPartner = foodPartner;

    next();
  } catch (error) {
    console.log(chalk.red.bold("Middleware error: ", error));

    return res.status(401).json({
      message: "Something went wrong",
    });
  }
}

/*

A middleware that: 

  - Validates the JWT inside cookies
  - Confirms the token belongs to a valid user 
  - Attaches req.user so controllers can use it 
  - Blocks unauthorized users 

  When the user sends a request -> the cookie automatically goes with it. Middleware extracts the cookie: req.cookies.token 

  JWT verifies the user. If valid -> fetch user from DB. If valid -> attach: req.user = user 

*/

async function authUserMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false, 
        message: "Unauthorized! Please login first.",
        error: "Token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) ; 

    const user = await userModel.findById(decoded.id)

    if(!user){
      return res.status(401).json({
        success: false, 
        message: "Invalid token! User doesn't exist anymore.",
        error: "ACCOUNT_NOT_FOUND"
      })
    }

    req.user = user ; // imp for controllers to identify user 

    next() ; 

  } catch (error) {
    console.log(chalk.red.bold("Auth user middleware error: ", error))

    return res.status(500).json({
      success: false, 
      error: error.message, 
      message: "Authentication failed"
    })
  }
}

export { authFoodPartnerMiddleware, authUserMiddleware };
