const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// resgister controller
const registerUser = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      dob, 
      gender, 
      mobileNumber, 
      email, 
      password 
    } = req.body;

    if (!firstName || !lastName || !dob || !gender || !mobileNumber || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      dob,
      gender,
      mobileNumber,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.firstName,
        email: newUser.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.error(error);
    
  }
};

// login controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {registerUser , loginUser};