const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dob: Date,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },
  mobileNumber: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  }
}, { timestamps: true });


// 🔐 HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});
module.exports = mongoose.model("User", userSchema);