const { sweatModel } = require("../models/sweat")

const ErrorResponse = require("../utils/errorsResponse")
const tryCatchHandler = require("../middleware/tryCatchHandler")
const sharp = require("sharp")
const { uploader } = require("../middleware/cloudinaryConfig")
const DatauriParser = require("datauri/parser")
const path = require("path")

// get all sweat shirts
exports.getsweats = tryCatchHandler(async (req, res, next) => {
  // pagination filtering and sorting
  var sortedBy = req.query.sortBy || "createdAt"
  var order = parseInt(req.query.order) || -1
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const startIndex = (page - 1) * limit

  let sweatNumber = await sweatModel.countDocuments()
  const sweats = await sweatModel
    .find()
    // .populate({
    //   path: "publisher",
    //   select: "name email _id profilPicture",
    // })
    .skip(startIndex)
    .limit(limit)
    .sort({ [sortedBy]: order })
  // search shirt by title  or tags
  if (req.query.search) {
    const sweats = await sweatModel
      .find({
        $or: [
          { title: { $regex: req.query.search, $options: "i" } },
          {
            tags: {
              $regex: req.query.search,
              $options: "i",
            },
          },
        ],
      })

      // .populate({
      //   path: "publisher",
      //   select: "name email _id profilPicture",
      // })
      .skip(startIndex)
      .limit(limit)
      .sort({ [sortedBy]: order })
      .select("title _id tags ")
    return res.status(200).json({
      numbOfSweats: sweatNumber,
      sweats: sweats,
      categorie: "Sweat-shirt",
    })
  }
  if (!sweats) {
    return res
      .status(404)
      .send("aucun article trouver ... veuillez réessayer plus tard")
  }
  res.status(200).json({
    numbOfSweats: sweatNumber,
    sweats: sweats,
    categorie: "Sweat-shirt",
  })
})

// get a specific sweatShirt
// @route /api/shirty/sweats/:id
exports.getsweat = tryCatchHandler(async (req, res, next) => {
  const sweats = await sweatModel.findById(req.params.id).populate({
    path: "publisher",
    select: "name email _id",
  })

  if (!sweats) {
    return next(
      new ErrorResponse(`aucun article trouver avec l'id ${req.params.id}`, 404)
    )
  }
  res.status(200).send(sweats)
})
// create a sweatshirt
// @route /api/shirty/sweat
exports.createsweat = tryCatchHandler(async (req, res, next) => {
  //   if we want to upload a new sweat shirt to the store
  if (req.file) {
    const buffer = await sharp(req.file.buffer).resize(500).png().toBuffer()
    const parser = new DatauriParser() // create a new instance of the parser
    const file = parser.format(
      path.extname(req.file.originalname).toString(),
      buffer
    ).content // parse the buffer into a base64 string

    // upload the file to cloudinary
    await uploader.upload(file).then(async (result) => {
      const imageUri = result.url
      const { title, prix, tags, description, couleur } = req.body
      let sweatTof = await sweatModel.create({
        image: imageUri,
        title,
        prix,
        tags,
        description,
        couleur,
      })
      await sweatTof.save()
      res.send("photo télécharger avec succés")
    })
  }
  //   const newSweat = await sweatModel.create(req.body)
})
// modify a sweat
// @route /api/shirty/sweats/:id
exports.editsweat = tryCatchHandler(async (req, res, next) => {
  const sweat = await sweatModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!sweat) {
    return next(
      new ErrorResponse(`aucun sweat trouver avec l'id ${req.params.id}`, 404)
    )
  }
  res.status(200).send(sweat)
})
// delete a shirt
// @route /api/shirty/sweats/:id
exports.deletesweat = tryCatchHandler(async (req, res, next) => {
  const cloudinaryImg = await sweatModel.findById(req.params.id)
  uploader.destroy(
    cloudinaryImg.image.slice(58).replace(".png", ""),
    function (result, error) {
      console.log(result, error)
    }
  )
  const sweat = await sweatModel.findByIdAndDelete(req.params.id)

  if (!sweat) {
    return next(
      new ErrorResponse(`Aucun sweat trouver avec l'id ${req.params.id}`, 404)
    )
  }
  res.status(200).send("le sweat a bien été supprimer")
})
