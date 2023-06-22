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
    expressValidator.check("username").trim(),
], authController.postSignin);

router.post("/signout", isAuth, authController.postSignout);

router.post("/signup", [
    expressValidator.check("fullName").trim().escape().isAlpha("en-US", {ignore: " "}).withMessage("Invalid full name. A full name should contain only letters.").isLength({min: 1}),
    expressValidator.check("username").trim().escape().isAlphanumeric().withMessage("Invalid username. An username should contain only letters and numbers.").isLength({min: 1}),
    expressValidator.check("email").trim().escape().isEmail().withMessage("Invalid email. Please provide a real email."),
    expressValidator.check("password").isAlphanumeric().isLength({min: 10}).withMessage("Invalid password. A password should have at least 10 characters."),
    expressValidator.check("password").custom(password => {
        const hasLetters = /[a-zA-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        return hasLetters && hasNumbers;
    }).withMessage("Invalid password. A password should contain letters and numbers."),
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