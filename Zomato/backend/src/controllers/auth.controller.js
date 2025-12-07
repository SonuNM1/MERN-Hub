import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import chalk from "chalk";
import jwt from "jsonwebtoken";

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
            fullName: user.fullName
        }
    })

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

export { registerUser, loginUser };
