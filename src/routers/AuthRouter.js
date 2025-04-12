const express = require("express");
const authRouter = new express.Router();
const userAuth = require("../controllers/UserController");


authRouter.post("/register",userAuth.registrationWithPass);
authRouter.post("/login",userAuth.loginWithPass);
authRouter.post("/sendOtp",userAuth.sendOtp);
authRouter.post("/verifyOtp",userAuth.verifyOtp);

module.exports = authRouter;
