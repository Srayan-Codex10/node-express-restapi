require('dotenv').config();

const db = require('../db/db');
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();

app.use(morgan(':date[iso] :method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));


const routes = require("../routes/route");
app.use("/lib", routes);

db.connect();

function homeRoute(req, res) {
    console.log(req.params);
    console.log(req.query);
    res.send(`<h1>I am at ${req.params.path} ${JSON.stringify(req.query)}</h1>`);
}

app.listen(process.env.PORT, () => {
    console.log(`Express Listening`);
});