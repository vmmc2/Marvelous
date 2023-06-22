// Third-Party Package Imports
const express = require("express");
const expressValidator = require("express-validator");

// Local Imports
const isAuth = require("../middlewares/is-auth");
const authController = require("../controllers/auth");

const router = express.Router();

// GET Routes
router.get("/signin", authController.getSignin);

router.get("/signup", authController.getSignup);

// POST Routes
router.post("/signin", authController.postSignin);

router.post("/signout", isAuth, authController.postSignout);

router.post("/signup", authController.postSignup);

module.exports = router;