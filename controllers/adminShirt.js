const { shirtPhotoModel } = require("../models/adminShirt")
const ErrorResponse = require("../utils/errorsResponse")
const tryCatchHandler = require("../middleware/tryCatchHandler")
const sharp = require("sharp")
const { uploader } = require("../middleware/cloudinaryConfig")
const DatauriParser = require("datauri/parser")
const path = require("path")
// add new shirt photo
exports.uploadshirt = tryCatchHandler(async (req, res, next) => {
  // console.log(req.user)
  if (req.file) {
    const buffer = await sharp(req.file.buffer).png().toBuffer()

    const parser = new DatauriParser() // create a new instance of the parser
    const file = parser.format(
      path.extname(req.file.originalname),
      buffer
    ).content // parse the buffer into a datauri

    // upload the file to cloudinary
    await uploader.upload(file).then(async (result) => {
      const imageUri = result.url
      let shirtTof = await shirtPhotoModel.create({ shirtTof: imageUri })
      await shirtTof.save()
      res.send("photo télécharger avec succés")
    })
  }
})
