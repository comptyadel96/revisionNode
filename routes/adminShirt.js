const router = require("express").Router()
const { uploadshirt } = require("../controllers/adminShirt")
const { isAuthentificated } = require("../middleware/authProtection")
const multer = require("multer")

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

// protected route
router.route("/shirtPhoto").post([uploader,isAuthentificated], uploadshirt)
module.exports = router
