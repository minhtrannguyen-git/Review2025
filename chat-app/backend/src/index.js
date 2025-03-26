"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
// import dotenv from "dotenv";
// dotenv.config();
var app = (0, express_1.default)();
app.get('/', function (req, res) {
    res.send("Hello from port " + process.env.PORT);
});
app.listen(5001, function () {
    console.log("listening on port " + 5001);
});
