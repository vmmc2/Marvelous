// Third-Party Package Imports
require("dotenv").config({path: __dirname + "/.env"});
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Local Imports
const authRoutes = require("./routes/auth");

// Useful Constants
const mongodbUrl = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PSW}@cluster0.aeywkmi.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;

// Server Creation
const app = express();

// Server Internal Config
app.set("views", "views");
app.set("view engine", "ejs");


// Middlewares: Pre-defined and User-defined
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use(authRoutes);

app.use("/", (req, res, next) => {
    res.status(200).send("<h1> Hello World! </h1>");
});

// Server Binding
mongoose.connect(mongodbUrl)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });