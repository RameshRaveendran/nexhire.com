// evironment variable configuration
require("dotenv").config();
// default requires
const express = require("express");
const path = require("path");
const axios = require("axios")
const cookieParser = require("cookie-parser");



// local requires
const connectDB = require("../src/config/db");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const searchHistoryRoutes = require("./routes/searchHistoryRoutes");
const pageRoutes = require("./routes/pageRoutes");
const authPageRoutes = require("./routes/authPageRoutes");













// server app created 
const app = express();


// Debug check (temporary) /////////////////////////////////////////////////////////

// view engine config
app.set("view engine", "ejs");
app.set(
  "views",
  path.join(__dirname, "views")
);

// middleware to parse json
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// calling the db
connectDB();


// routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/search-history", searchHistoryRoutes);
app.use("/", pageRoutes);
app.use("/", authPageRoutes);



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