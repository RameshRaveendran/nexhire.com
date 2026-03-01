const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  dob: {
    type: Date,
    required: true
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true
  },

  mobileNumber: {
    type: String,
    unique: true,
    sparse: true
  },

  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  searchHistory: [
    {
      query: String,
      searchedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);