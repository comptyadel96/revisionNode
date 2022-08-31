const { shirtModel } = require("../models/shirt")
const { shirtPhotoModel } = require("../models/adminShirt")
const ErrorResponse = require("../utils/errorsResponse")
const tryCatchHandler = require("../middleware/tryCatchHandler")
const sharp = require("sharp")
const { uploader } = require("../middleware/cloudinaryConfig")
const datauri = require("datauri")
const path = require("path")
// get all the shirts
// @route /api/shirty/shirts
exports.getshirts = tryCatchHandler(async (req, res, next) => {
  // pagination filtering and sorting
  var sortedBy = req.query.sortBy || "createdAt"
  var order = req.query.order || "desc"
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const startIndex = (page - 1) * limit

  const shirts = await shirtModel
    .find()
    .populate({
      path: "publisher",
      select: "name email _id",
    })
    .skip(startIndex)
    .limit(limit)
    .sort({ [sortedBy]: order })
  // search shirt by its title or content of body
  if (req.query.search) {
    const shirts = await shirtModel
      .find({ $text: { $search: req.query.search } })
      .populate({
        path: "publisher",
        select: "name email _id",
      })
      .skip(startIndex)
      .limit(limit)
      .sort({ [sortedBy]: order })
    return res.status(200).json({
      numbOfshirts: shirts.length,
      shirts: shirts,
    })
  }

  if (!shirts) {
    return res.status(404).send("no shirts found")
  }
  res.status(200).json({
    numbOfshirts: shirts.length,
    shirts: shirts,
  })
})
// get a specific shirt
// @route /api/shirty/shirts/:id
exports.getshirt = tryCatchHandler(async (req, res, next) => {
  const shirt = await shirtModel.findById(req.params.id)
  // .populate({
  //   path: "publisher",
  //   select: "name email _id",
  // })

  if (!shirt) {
    return next(
      new ErrorResponse(`shirt not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).send(shirt)
})
// create a shirt
// @route /api/shirty/shirts
exports.createshirt = tryCatchHandler(async (req, res, next) => {
  const newshirt = await shirtModel.create(req.body)
  res.status(201).send(newshirt)
})
// modify a shirt
// @route /api/shirty/shirts/:id
exports.editshirt = tryCatchHandler(async (req, res, next) => {
  const shirt = await shirtModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!shirt) {
    return next(
      new ErrorResponse(`shirt not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).send(shirt)
})
// delete a shirt
// @route /api/shirty/shirts/:id
exports.deleteshirt = tryCatchHandler(async (req, res, next) => {
  const shirt = await shirtModel.findByIdAndDelete(req.params.id)
  if (!shirt) {
    return next(
      new ErrorResponse(`shirt not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).send(shirt)
})

// upload a shirt image to cloudinary and save it to the database (for admin)
exports.uploadshirt = tryCatchHandler(async (req, res, next) => {
  res.send(req.file)
  if (req.file) {
    const buffer = await sharp(req.file.buffer).png().toBuffer()

    const parser = new datauri() // create a new instance of the parser
    const file = parser.format(
      path.extname(req.file.originalname).toString(),
      buffer
    ).content // parse the buffer into a base64 string

    // upload the file to cloudinary
    await uploader.upload(file).then(async (result) => {
      const imageUri = result.url
      let shirtTof = await shirtPhotoModel.create({ shirtTof: imageUri })
      await shirtTof.save()
      res.send("photo télécharger avec succés")
    })
  }
})
