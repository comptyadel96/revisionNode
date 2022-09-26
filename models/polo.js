const mongoose = require("mongoose")
const polloSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "vous devez attribuer un titre a votre article"],
    maxlength: [100, "Le titre ne doit pas dépasser 100 lettres"],
    minlength: [5, "Le titre doit contenir aumoins 5 lettre ou plus"],
    unique: [true, "Ce titre a déja été choisi veuillez choisir un autre"],
  },
  image: String,
  description: {
    type: String,
    minlength: [10, "La Description doit contenir aumoins 10 characters"],
    maxlength: [2000, "La Description ne doit pas dépasser 2000 characters"],
    required: [true, "Vous devez attribuer une Description  à votre article"],
  },
  prix: {
    type: String,
    minlength: [3, "Le prix doit contenir aumoins 3 chiffres"],
    maxlength: [5, "La prix ne doit pas dépasser 5 chiffres"],
    required: [true, "Vous devez attribuer un prix  à votre article"],
  },
  couleur: {
    type: String,
    required: [true, "veuillez spécifier la couleur du pollo s'il vous plait"],
    enum: [
      "Noir",
      "Blanc",
      "Rouge",
      "Bleu",
      "Marron",
      "Gris",
      "Rose",
      "Vert",
      "Orange",
      "Violet",
      "Jaune",
    ],
  },
  tags: {
    type: [String],
    default: ["demi manche", "pollo", "pull"],
  },
  sexe: {
    type: String,
    enum: ["homme", "femme", "enfant"],
  },
  note: {
    type: [String],
    default: [],
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
  //   required: true,
  // },
})

// Schema indexes
polloSchema.index({ title: "text", description: "text", tags: "text" })

const polloModel = mongoose.model("pollo", polloSchema)

module.exports = { polloSchema, polloModel }
