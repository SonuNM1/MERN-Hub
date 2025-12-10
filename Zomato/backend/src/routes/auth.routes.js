import express from "express"
import { loginFoodPartner, loginUser, logoutFoodPartner, logoutUser, registerFoodPartner, registerUser } from "../controllers/auth.controller.js";

const router = express.Router() ; 

// user auth APIs

router.post('/user/register', registerUser)

router.post('/user/login', loginUser)

router.get('/user/logout', logoutUser)

// food partner auth APIs

router.post('/food-partner/register', registerFoodPartner)

router.post('/food-partner/login', loginFoodPartner)

router.get('/food-partner/logout', logoutFoodPartner)

export default router ; 