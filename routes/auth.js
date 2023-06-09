const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

// GET Routes
router.get("/signin", authController.getSignin);

router.get("/signup", authController.getSignup);

// POST Routes
router.post("/signin", authController.postSignin);

router.post("/signup", authController.postSignup);

module.exports = router;