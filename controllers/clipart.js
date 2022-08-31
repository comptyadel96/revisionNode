const { clipartModel } = require("../models/clipart")

// get all the clipart
exports.getclipart = async function (req, res) {
  const cliparts = await clipartModel.find()
  if (cliparts) {
   await res.status(200).send(cliparts)
  } else {
   await res.status(404).send("aucun clipart trouver dans la base de donnés")
  }
}
// create clipart
exports.createClipart = async function (req, res) {
  const cliparts = await clipartModel.create(req.body)
  await cliparts.save()
  await res.status(200).send(cliparts)
}
