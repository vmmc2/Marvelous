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
router.post("/signin", [
    expressValidator.check("username").trim().escape().isLength({min: 1}).isAlphanumeric().withMessage("Invalid username provided. An username should contain only letters and numbers."),
    expressValidator.check("password").isLength({min: 10}).isAlphanumeric().withMessage("A password must have at least 10 characters and have only letters and numbers.")
], authController.postSignin);

router.post("/signout", isAuth, authController.postSignout);

router.post("/signup", [
    expressValidator.check("fullName").trim().escape().isLength({min: 1}).isAlpha({ignore: " "}).withMessage("Invalid full name provided. A full name should only contain letters."),
    expressValidator.check("username").trim().escape().isLength({min: 1}).isAlphanumeric().withMessage("Invalid username provided. An username should contain only letters and numbers."),
    expressValidator.check("email").trim().escape().isEmail().withMessage("Invalid email provided. Please provide an actual email."),
    expressValidator.check("password").isLength({min: 10}).isAlphanumeric().withMessage("A password must have at least 10 characters and have only letters and numbers."),
    expressValidator.check("confirmPassword").custom((confirmPassword, {req}) => {
        const password = req.body.password;
        if(password !== confirmPassword){
            return false;
        }else{
            return true;
        }
    }).withMessage("The values inside 'password' and 'confirmPassword' must be identical.")
], authController.postSignup);

module.exports = router;