const mongoose = require("mongoose")
const shirtPhotoSchema = new mongoose.Schema({
  name: String,
  shirtTof: String,
  descrption: String,
  price: String,
  couleur:{
    type:String,
    enum:["Noir","Blanc","Rouge","Bleu","Marron","Gris","Rose","Vert","Orange","Violet","Jaune"]
  }
})
const shirtPhotoModel = mongoose.model("shirtPhotos", shirtPhotoSchema)

module.exports = { shirtPhotoModel }
