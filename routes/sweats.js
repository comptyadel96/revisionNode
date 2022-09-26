const router = require("express").Router()
const {
  getsweats,
  getsweat,
  createsweat,
  editsweat,
  deletesweat,
} = require("../controllers/sweats")
const { isAuthentificated } = require("../middleware/authProtection")
const multer = require("multer")

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
}).single("sweatTof")

// public routes
router.route("/sweats").get(getsweats).post(
  // isAuthentificated,
  uploader,
  createsweat
)
// protected routes (need authentification)
router
  .route("/sweats/:id")
  .get(getsweat)
  .put(isAuthentificated, editsweat)
  .delete( deletesweat)
module.exports = router
