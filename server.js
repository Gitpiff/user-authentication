const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");



app.use(express.json());
app.use(morgan("dev"));

mongoose.connect(
    `mongodb://localhost:27017/user-authentication`,
    () => console.log("Connected to Mongo DB")
);

app.use("/auth", require("./routes/authRouter"));

app.use("/todo", require("./routes/todoRouter"));

app.use((err, req, res, next) => {
    console.log(err);
    return res.send({errMsg: err.message});
});

app.listen(9000, () => {
    console.log("Server running on the local port 9000")
});


