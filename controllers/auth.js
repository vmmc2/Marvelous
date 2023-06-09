// Third-Party Package Imports
const bcrypt = require("bcryptjs");
const expressValidator = require("express-validator");

// Local Imports
const User = require("../models/user");

// Utility Constants

// Utility Functions
function getFlashErrorMessages(req){
    let messages = req.flash("error");
    if(messages.length < 1){
        messages = null;
    }
    return messages;
}

// Controller Actions
exports.getSignin = (req, res, next) => {
    console.log("Received a GET request to the '/signin' route.");
    const flashErrorMessages = getFlashErrorMessages(req);

    res.status(200).render("auth/signin", {
        pageTitle: "Sign In",
        path: "/signin",
        flashErrorMessages: flashErrorMessages,
        validationErrors: [],
        userData: {
            username: "",
            password: ""
        }
    });
}

exports.getSignup = (req, res, next) => {
    console.log("Received a GET request to the '/signup' route.");
    const flashErrorMessages = getFlashErrorMessages(req);

    res.status(200).render("auth/signup", {
        pageTitle: "Sign Up",
        path: "/signup",
        flashErrorMessages: flashErrorMessages,
        validationErrors: [],
        userData: {
            fullName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });
}

exports.getUpdatePassword = (req, res, next) => {
    console.log("Received a GET request to the '/update-password' route.");
    const flashErrorMessages = getFlashErrorMessages(req);

    res.status(200).render("auth/updatePassword", {
        pageTitle: "Update Password",
        path: "/updatePassword",
        flashErrorMessages: flashErrorMessages,
        validationErrors: [],
        userData: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        }
    });
}

exports.postSignin = (req, res, next) => {
    console.log("Received a POST request to the /signin route.");
    const username = req.body.username;
    const password = req.body.password;
    const validationErrors = expressValidator.validationResult(req).array().filter(valError => valError.msg !== "Invalid value");

    if(validationErrors.length > 0){
        return res.status(400).render("auth/signin", {
            pageTitle: "Sign In",
            path: "/signin",
            flashErrorMessages: null,
            validationErrors: validationErrors,
            userData: {
                username: username,
                password: password
            }
        });
    }

    User.findOne({username: username})
        .then(user => {
            if(!user){
                req.flash("error", "Wrong username or password.");
                return res.redirect("/signin");
            }else{
                bcrypt.compare(password, user.password)
                    .then(isPasswordCorrect => {
                        if(isPasswordCorrect){
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            return req.session.save(result => {
                                res.redirect("/");
                            });
                        }else{
                            req.flash("error", "Wrong username or password.");
                            return res.redirect("/signin");
                        }
                    })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        next(error);
                    });
            }
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
}

exports.postSignout = (req, res, next) => {
    console.log("Received a POST request to the '/signout' route.");
    req.session.destroy(err => {
        console.log(err);
        res.redirect("/");
    });
}

exports.postSignup = (req, res, next) => {
    console.log("Received a POST request to the '/signup' route.");
    const fullName = req.body.fullName;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.password;
    const validationErrors = expressValidator.validationResult(req).array().filter(valError => valError.msg !== "Invalid value");

    if(validationErrors.length > 0){
        return res.status(400).render("auth/signup", {
            pageTitle: "Sign Up",
            path: "/signup",
            flashErrorMessages: null,
            validationErrors: validationErrors,
            userData: {
                fullName: fullName,
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            }
        });
    }

    User.findOne({username: username, email: email})
        .then(user => {
            if(!user){
                bcrypt.hash(password, parseInt(`${process.env.NUMBER_SALTS}`, 10))
                    .then(encryptedPassword => {
                        const newUser = new User({
                            fullName: fullName,
                            username: username,
                            email: email,
                            password: encryptedPassword,
                        });
                        return newUser.save();
                    })
                    .then(result => {
                        res.redirect("/signin");
                    })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        next(error);
                    });
            }else{
                req.flash("error", "Username or Email are already been used by another user.");
                return res.redirect("/signup");
            }
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
}

exports.postUpdatePassword = (req, res, next) => {
    console.log("Received a POST request to the '/update-password' route.");

    const currentUser = req.session.user;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confirmNewPassword = req.body.confirmNewPassword;
    const validationErrors = expressValidator.validationResult(req).array().filter(valError => valError.msg !== "Invalid value");

    if(validationErrors.length > 0){
        return res.status(400).render("auth/updatePassword", {
            pageTitle: "Update Password",
            path: "/update-password",
            flashErrorMessages: null,
            validationErrors: validationErrors,
            userData: {
                currentPassword: currentPassword,
                newPassword: newPassword,
                confirmNewPassword: confirmNewPassword
            }
        });
    }

    User.findOne({username: currentUser.username, email: currentUser.email})
        .then(user => {
            if(!user){
                req.flash("error", "User not found.");
                return res.redirect("/update-password");
            }else{
                return bcrypt.compare(currentPassword, user.password)
                    .then(isPasswordCorrect => {
                        if(isPasswordCorrect){
                            bcrypt.hash(newPassword, parseInt(`${process.env.NUMBER_SALTS}`, 10))
                                .then(encryptedNewPassword => {
                                    return User.findOneAndUpdate({username: currentUser.username, email: currentUser.email}, {$set: {password: encryptedNewPassword}});
                                })
                                .then(result => {
                                    res.redirect("/");
                                })
                                .catch(err => {
                                    const error = new Error(err);
                                    error.httpStatusCode = 500;
                                    next(error);
                                });
                        }else{
                            req.flash("error", "Current Password is incorrect. Please try again.");
                            return res.redirect("/update-password");
                        }
                    })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        next(error);
                    });
            }
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
}