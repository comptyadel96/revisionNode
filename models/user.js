const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      minLength: [10, "Email must be at least 10 characters long"],
      maxlength: [100, "Email must be at most 100 characters long"],
      unique: true,
      trim: true,
    },
    profilPicture: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const userModal = mongoose.model("User", userSchema)
module.exports = userModal
