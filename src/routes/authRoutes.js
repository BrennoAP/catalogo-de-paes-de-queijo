import { Router } from "express";
import { loginForm, loginUser, logoutUser } from "../controllers/authController.js";

const router = Router();

router.get("/login", loginForm);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;