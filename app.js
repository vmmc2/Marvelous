// Third-Party Package Imports
require("dotenv").config({path: __dirname + "/.env"});
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

// Local Imports
const authRoutes = require("./routes/auth");

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
app.listen(3000);