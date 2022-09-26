const router = require("express").Router()
const {
  getpolos,
  getpolo,
  createpolo,
  editpolo,
  deletepolo,
} = require("../controllers/polos")
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
}).single("poloTof")

// public routes
router.route("/polos").get(getpolos).post(
  // isAuthentificated,
  uploader,
  createpolo
)
// protected routes (need authentification)
router
  .route("/polos/:id")
  .get(getpolo)
  .put(isAuthentificated, editpolo)
  .delete(deletepolo)
module.exports = router
