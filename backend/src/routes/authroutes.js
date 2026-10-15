import express from "express";
import { register, login, getMe } from "../controller/authcontroller.js";
import { protectRoute } from "../middlewere/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protectRoute, getMe);

export default router;
