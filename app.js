require("dotenv").config({path: __dirname + "/.env"});
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("views", "views");
app.set("view engine", "ejs");

app.use("/", (req, res, next) => {
    res.status(200).send("<h1> Hello World! </h1>");
});

app.listen(3000);