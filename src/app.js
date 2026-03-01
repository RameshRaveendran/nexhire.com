// evironment variable configuration
require("dotenv").config();
// default requires
const express = require("express");

// local requires
const connectDB = require("./config/db");


// server app created 
const app = express();

// middleware to parse json
app.use(express.json());

// calling the db
connectDB();

// test route
app.get("/",(req , res) => {
    res.status(200).json({
        message: "Nexhire Backend Running"
    });
});

// server port
const PORT = process.env.PORT || 5000;

app.listen(PORT , () =>{
    console.log(`Server running on port ${PORT}`);
})