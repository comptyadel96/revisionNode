const { shirtModel } = require("../models/shirt")
const ErrorResponse = require("../utils/errorsResponse")
const tryCatchHandler = require("../middleware/tryCatchHandler")
const sharp = require("sharp")
const { uploader } = require("../middleware/cloudinaryConfig")
const DatauriParser = require("datauri/parser")
const path = require("path")
// get all the shirts
// @route /api/shirty/shirts
exports.getshirts = tryCatchHandler(async (req, res, next) => {
  // pagination filtering and sorting
  var sortedBy = req.query.sortBy || "createdAt"
  var order = parseInt(req.query.order) || -1
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const startIndex = (page - 1) * limit

  // number of shirts
  let numberOfShirts = await shirtModel.countDocuments()
  const shirts = await shirtModel
    .find()

    // .populate({
    //   path: "publisher",
    //   select: "name email _id profilPicture",
    // })
    .sort({ [sortedBy]: order })
    .skip(startIndex)
    .limit(limit)

  // search shirt by title  or tags
  if (req.query.search) {
    const shirts = await shirtModel
      .find({
        $or: [
          { title: { $regex: req.query.search.trimEnd(), $options: "i" } },
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
      numbOfshirts: numberOfShirts,
      shirts: shirts,
      categorie: "t-shirts",
    })
  }

  if (!shirts) {
    return res
      .status(404)
      .send("aucun article trouver ... veuillez réessayer plus tard")
  }
  res.status(200).json({
    numbOfshirts: numberOfShirts,
    shirts: shirts,
  })
  console.log(req.query)
})
// get a specific shirt
// @route /api/shirty/shirts/:id
exports.getshirt = tryCatchHandler(async (req, res, next) => {
  const shirt = await shirtModel.findById(req.params.id).populate({
    path: "publisher",
    select: "name email _id",
  })

  if (!shirt) {
    return next(
      new ErrorResponse(`aucun article trouver avec l'id ${req.params.id}`, 404)
    )
  }
  res.status(200).send(shirt)
})
// create a shirt
// @route /api/shirty/shirts
exports.createshirt = tryCatchHandler(async (req, res, next) => {
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
      let shirtTof = await shirtModel.create({
        image: imageUri,
        title,
        prix,
        tags,
        description,
        couleur,
      })
      await shirtTof.save()
      res.send("photo télécharger avec succés")
    })
  }
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
      new ErrorResponse(`aucun t-shirt trouver avec l'id ${req.params.id}`, 404)
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
      new ErrorResponse(`aucun t-shirt trouver avec l'id ${req.params.id}`, 404)
    )
  }
  res.status(200).send(shirt)
})
