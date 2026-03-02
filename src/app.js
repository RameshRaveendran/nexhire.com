// evironment variable configuration
require("dotenv").config();
// default requires
const express = require("express");
const path = require("path");
const axios = require("axios")

// local requires
const connectDB = require("../src/config/db");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");







// server app created 
const app = express();


// Debug check (temporary) /////////////////////////////////////////////////////////


// middleware to parse json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// calling the db
connectDB();


// routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);


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