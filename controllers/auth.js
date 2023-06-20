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
    res.redirect("/");
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
            if(user){ // Um usuario com as mesmas credenciais foi encontrado. Nao pode criar conta. Fazer validacao adequadamente.
                return res.redirect("/signup");
            }else{ // Pode criar conta. Salva no banco de dados e redireciona para pagina de signin.
                const newUser = new User({
                    fullName: fullName,
                    username: username,
                    email: email,
                    password: password,
                });
                return newUser.save() // Melhorar essa parte de salvar um usuario ao realizar o cadastro dele.
                    .then(result => {
                        console.log(result);
                        console.log("User has been successfully created.");
                        res.redirect("/signin");
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
        .catch(err => { // Realizar tratamento de erros adequadamente.
            console.log(err);
        });
}