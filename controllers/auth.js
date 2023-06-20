// Third-Party Package Imports
const bcrypt = require("bcryptjs");

// Local Imports
const User = require("../models/user");

exports.getSignin = (req, res, next) => {
    console.log("Received a GET request to the '/signin' route.");
    res.status(200).render("auth/signin", {
        pageTitle: "Sign In",
        path: "/signin"
    });
}

exports.getSignup = (req, res, next) => {
    console.log("Received a GET request to the '/signup' route.");
    res.status(200).render("auth/signup", {
        pageTitle: "Sign Up",
        path: "/signup"
    });
}

exports.postSignin = (req, res, next) => {
    console.log("Received a POST request to the /signin route.");

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username})
        .then(user => {
            if(!user){ // Usuario nao encontrado no banco de dados. Nao pode fazer login. 
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
                        }else{ // Usuario nao forneceu a senha correta.
                            return res.redirect("/signin");
                        }
                    })
                    .catch(err => { // Realizar tratamento de erros adequadamente.
                        console.log(err);
                    });
            }
        })
        .catch(err => { // Realizar tratamento de erros adequadamente.
            console.log(err); 
        });
}


exports.postSignout = (req, res, next) => {
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

    User.findOne({username: username, email: email})
        .then(user => {
            if(!user){ // Pode criar conta. Encripta a senha, salva no banco de dados. Redireciona para a rota "/signin".
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
                        console.log(result);
                        console.log("User has been successfully created.");
                        res.redirect("/signin");
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }else{ // Um usuario com as mesmas credenciais foi encontrado. Nao pode criar conta. Fazer validacao adequadamente.
                return res.redirect("/signup");
            }
        })
        .catch(err => { // Realizar tratamento de erros adequadamente.
            console.log(err);
        });
}