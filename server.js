const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const {expressjwt} = require('express-jwt');


app.use(express.json());
app.use(morgan("dev"));

mongoose.connect(
    `mongodb://localhost:27017/user-authentication`,
    () => console.log("Connected to Mongo DB")
);

//"gatekeeper" so we don't display any info if the user is not authenticated, this way the only public page will be the sign in page
app.use("/api", expressjwt({secret: process.env.SECRET, algorithms: ["HS256"]}))

app.use("/auth", require("./routes/authRouter"));

app.use("/api//todo", require("./routes/todoRouter"));


//Catch error message
app.use((err, req, res, next) => {
    console.log(err)
    if(err.name === "UnauthorizedError"){
        res.status(err.status)
    }
    return res.send({errMsg: err.message});
});

app.listen(9000, () => {
    console.log("Server running on the local port 9000")
});


