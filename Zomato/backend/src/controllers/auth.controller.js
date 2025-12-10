import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import chalk from "chalk";
import jwt from "jsonwebtoken";
import foodPartnerModel from "../models/foodpartner.model.js";

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    // check if user already exists

    const isUserAlreadyExists = await userModel.findOne({
      email,
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.log(chalk.red.bold("Register user error: ", error));

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // check if user exists

    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // check password

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Set Cookie

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Send response

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(chalk.red.bold("Login error: ", error));

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

async function logoutUser(_, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      messsage: "User logged out successfully",
    });
  } catch (error) {
    console.log(chalk.red.bold("Logout error: "), error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

async function registerFoodPartner(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
      email,
    });

    if (isAccountAlreadyExists) {
      return res.status(400).json({
        message: "Food partner account already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Food partner registered successfully",
      partner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        fullName: foodPartner.fullName,
      },
    });

  } catch (error) {
    console.log(chalk.red.bold("Register Food partner error: ", error))

    return res.status(500).json({
        message: "Something went wrong"
    })
  }
}

async function loginFoodPartner(req, res){
    try {
    const { email, password } = req.body;

    // check if user exists

    const foodPartner = await foodPartnerModel.findOne({
      email,
    });

    if (!foodPartner) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // check password

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token

    const token = jwt.sign(
        {id: foodPartner._id},
        process.env.JWT_SECRET_KEY, 
        {expiresIn: "7d"}
    );

    // Set Cookie

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response

    return res.status(200).json({
      message: "Login successful",
      partner: {
        _id: foodPartner._id,
        fullName: foodPartner.fullName,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    console.log(chalk.red.bold("Login error: ", error));

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

async function logoutFoodPartner(req, res){
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict"
        }) ; 

        return res.status(200).json({
            message: "Food partner logged out successfully"
        })
    } catch (error) {
        console.log(chalk.red.bold("Food partner logout error:", error))

        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export { registerUser, loginUser, logoutUser, registerFoodPartner, loginFoodPartner, logoutFoodPartner };
