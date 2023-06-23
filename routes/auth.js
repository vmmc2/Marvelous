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

router.get("/update-password", isAuth, authController.getUpdatePassword);

// POST Routes
router.post("/signin", [
    expressValidator.check("username").trim(),
], authController.postSignin);

router.post("/signout", isAuth, authController.postSignout);

router.post("/signup", [
    expressValidator.check("fullName").trim().escape().isAlpha("en-US", {ignore: " "}).withMessage("Invalid full name. A full name should contain only letters.").isLength({min: 1}),
    expressValidator.check("username").trim().escape().isAlphanumeric().withMessage("Invalid username. An username should contain only letters and numbers.").isLength({min: 1}),
    expressValidator.check("email").trim().escape().isEmail().withMessage("Invalid email. Please provide a real email."),
    expressValidator.check("password").isLength({min: 10}).withMessage("Invalid password. A password should have at least 10 characters."),
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
    }).withMessage("The values inside 'Password' and 'Confirm Password' must be identical.")
], authController.postSignup);

router.post("/update-password", isAuth, [
    expressValidator.check("newPassword").isLength({min: 10}).withMessage("Invalid new password. A new password should have at least 10 characters."),
    expressValidator.check("newPassword").custom(newPassword => {
        const hasLetters = /[a-zA-Z]/.test(newPassword);
        const hasNumbers = /\d/.test(newPassword);
        return hasLetters && hasNumbers;
    }).withMessage("Invalid new password. A new password should contain letters and numbers."),
    expressValidator.check("confirmNewPassword").custom((confirmNewPassword, {req}) => {
        const newPassword = req.body.newPassword;
        if(newPassword !== confirmNewPassword){
            return false;
        }else{
            return true;
        }
    }).withMessage("The values inside 'New Password' and 'Confirm New Password' must be identical.")
], authController.postUpdatePassword);

module.exports = router;