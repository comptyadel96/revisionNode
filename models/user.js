const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    authProvider: {
      type: String,
      enum: ["google", "facebook"],
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
    phoneNumber: {
      type: String,
      min: [10, "le numéro de téléphone doit contenir aumoins 10 nombres"],
    },
  },

  { timestamps: true }
)

const userModal = mongoose.model("User", userSchema)
module.exports = userModal
