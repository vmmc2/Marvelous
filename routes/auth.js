const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/signin", authController.getSignin);

router.get("/signup", authController.getSignup);

router.post("/signin", authController.postSignin);

router.post("/signup", authController.postSignup);

module.exports = router;