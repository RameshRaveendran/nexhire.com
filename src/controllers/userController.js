const User = require("../models/User");

exports.registerUser = async (req, res) => {
    // Debug
    // console.log(req.body);
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
    res.status(500).json({ message: "Server Error" , error });
  }
};
