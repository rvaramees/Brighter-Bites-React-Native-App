import express from "express";
import registerUser from "../controllers/authController/parentRegister.js";
import loginUser from "../controllers/authController/parentLogin.js";

const router = express.Router();

// Route to handle parent registration
router.post("/register", registerUser);
// Route to handle parent login
router.post("/login", loginUser);
    
export default router;