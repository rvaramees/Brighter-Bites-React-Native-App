import express from "express";
import registerUser from "../controllers/authController/parent_register.js";
import loginUser from "../controllers/authController/parent_login.js";

const router = express.Router();

// Route to handle parent registration
router.post("/register", registerUser);
// Route to handle parent login
router.post("/login", loginUser);
    
export default router;