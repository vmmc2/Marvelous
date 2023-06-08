exports.getSignin = (req, res, next) => {

}

exports.getSignup = (req, res, next) => {
    console.log("Received the GET request to the '/signup' route.");
    res.status(200).render("auth/signup", {
        pageTitle: "Sign Up",
        path: "/signup"
    });
}

exports.postSignin = (req, res, next) => {

}

exports.postSignup = (req, res, next) => {
    console.log("Received the POST request to the '/signup' route.");
}