const mongoose = require("mongoose")
const clipartSchema = new mongoose.Schema({
  groupeTitle: String,
  url: [],
})
const clipartModel = mongoose.model("clipart", clipartSchema)

module.exports = { clipartModel }
