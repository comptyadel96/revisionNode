const mongoose = require("mongoose")
const shirtSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: [true, "Title is required"],
    // maxlength: [100, "Title must be less than 100 characters"],
    // minlength: [5, "Title must be at least 5 or more characters"],
    // unique: [true, "title must be unique"],
  },
  canvas:String,
  description: {
    type: String,
    minlength: [10, "Description must be at least 10 or more characters"],
    maxlength: [2000, "Description must be less than 2000 characters"],
    // required: [true, "Description is required"],
    // unique: [true, "Description must be unique"],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      //   required: true
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
      //   required: true
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // publisher: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // required: true,
  // },
})

// Schema indexes
shirtSchema.index({ title: "text", description: "text" })

const shirtModel = mongoose.model("shirt", shirtSchema)

module.exports = { shirtSchema, shirtModel }
