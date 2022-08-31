const mongoose = require("mongoose")
const shirtPhotoSchema = new mongoose.Schema({
  name: String,
  shirtTof: String,
  descrption: String,
  price: String,
})
const shirtPhotoModel = mongoose.model("shirtPhotos", shirtPhotoSchema)

module.exports = { shirtPhotoModel }
