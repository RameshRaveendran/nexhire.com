const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginPage = (req, res) => {
  res.render("login");
};

const registerPage = (req, res) => {
  res.render("register");
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Login failed");
  }
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, dob, gender, mobileNumber, email, password } = req.body;

    if (!firstName || !lastName || !dob || !gender || !mobileNumber || !email || !password) {
      return res.status(400).send("All fields required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("Email already registered");
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

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Registration failed");
  }
};

const logoutUser = (req, res) => {
  // Clear the token cookie
  res.clearCookie("token", { httpOnly: true });
  
  // Set cache-prevention headers to prevent browser back-button access
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  
  // Redirect to landing page
  res.redirect("/");
};

module.exports = {
  loginPage,
  registerPage,
  loginUser,
  registerUser,
  logoutUser
};
