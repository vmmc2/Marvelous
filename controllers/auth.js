const User = require("../models/user");

exports.getSignin = (req, res, next) => {
    console.log("Received the GET request to the '/signin' route.");
    res.status(200).render("auth/signin", {
        pageTitle: "Sign In",
        path: "/signin"
    });
}

exports.getSignup = (req, res, next) => {
    console.log("Received the GET request to the '/signup' route.");
    res.status(200).render("auth/signup", {
        pageTitle: "Sign Up",
        path: "/signup"
    });
}

exports.postSignin = (req, res, next) => {
    console.log("Received the POST request to the /signin route.");
    res.redirect("/");
}

exports.postSignup = (req, res, next) => {
    console.log("Received the POST request to the '/signup' route.");
    res.redirect("/signin");
}