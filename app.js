// Third-Party Package Imports
require("dotenv").config({path: __dirname + "/.env"});
const path = require("path");
const csurf = require("csurf");
const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Local Imports
const authRoutes = require("./routes/auth");

// Utility Constants
const mongodbUrl = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PSW}@cluster0.aeywkmi.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;
const store = new MongoDBStore({
    uri: mongodbUrl,
    databaseName: `${process.env.MONGODB_DBNAME}`,
    collection: "sessions"
}, err => {
    if(err){
        console.log(err);
    }
});
const csrfProtection = csurf();

// Server Creation
const app = express();

// Server Internal Config
app.set("views", "views");
app.set("view engine", "ejs");

// Third-Party Middlewares
app.use(session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: true,
    saveUninitialized: false,
    store: store
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));
app.use(csrfProtection);
app.use(flash());


// User-Defined Middlewares
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});


app.use(authRoutes);

app.use("/", (req, res, next) => {
    res.status(200).render("home", {
        pageTitle: "Marvelous",
        path: "/",
        isAuthenticated: req.session.isLoggedIn
    });
});

// Server Binding
mongoose.connect(mongodbUrl)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });