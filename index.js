const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv/config");
app.use(bodyParser.json());


// IMPORT API ROUTES
const router = require("./rest/calendar.rest.js");

// CREATE A CALENDAR EVENT
app.use("/calendar", router);

// CONNECT TO MONGO DB
// REMEMBER TO MAKE ALLOW USERS TO ACCESS IN CLUSTER
mongoose.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log("CONNECTED to Mongo DB!!");
});

// require("./dbclient").main();


// RUNNING PORT
app.listen(PORT, ()=>{
    console.log("We are on PORT: ", PORT);
});