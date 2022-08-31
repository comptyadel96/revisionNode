const router = require("express").Router()
const {
  getshirts,
  getshirt,
  createshirt,
  deleteshirt,
  editshirt,
} = require("../controllers/shirts")

// Public routes
router.route("/shirts").get(getshirts).post(createshirt)
// Private routes (need authentification)
router.route("/shirts/:id").get(getshirt).put(editshirt).delete(deleteshirt)

module.exports = router
