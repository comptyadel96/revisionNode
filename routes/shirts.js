const router = require("express").Router()
const { isAuthentificated } = require("../middleware/authProtection")
const multer = require("multer")

const {
  getshirts,
  getshirt,
  createshirt,
  deleteshirt,
  editshirt,
} = require("../controllers/shirts")
//upload image with multer
const uploader = multer({
  limits: {
    fileSize: 15000000, // 15mb
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/gi)) {
      return cb(
        new Error(
          "le type de fichier doit étre une image de taille inférieure ou égale a 15MBs"
        )
      )
    }
    cb(undefined, true)
  },
}).single("shirtTof")

// Public routes
router.route("/shirts").get(getshirts).post(uploader, createshirt)
// Private routes (need authentification)
router
  .route("/shirts/:id")
  .get(getshirt)
  .put(isAuthentificated, editshirt)
  .delete(deleteshirt)

module.exports = router
