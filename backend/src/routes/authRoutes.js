import express from "express";
import registerUser from "../controllers/authController/parentRegister.js";
import loginUser from "../controllers/authController/parentLogin.js";
import loginChild from "../controllers/authController/childLogin.js";

const router = express.Router();

// Route to handle parent registration
router.post("/parent/register", registerUser);
// Route to handle parent login
router.post("/parent/login", loginUser);
// Route to handle child login 
router.post("/child/login", loginChild);
export default router;