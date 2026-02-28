const express = require("express");

const app = express();

// middleware to parse json
app.use(express.json());

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