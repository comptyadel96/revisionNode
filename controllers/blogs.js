const { blogModel } = require("../models/blog")
const ErrorResponse = require("../utils/errorsResponse")
const tryCatchHandler = require("../middleware/tryCatchHandler")

// get all the blogs
// @route /api/bloogy/blogs
exports.getBlogs = tryCatchHandler(async (req, res, next) => {
  // pagination filtering and sorting
  var sortedBy = req.query.sortBy || "createdAt"
  var order = req.query.order || "desc"
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const startIndex = (page - 1) * limit

  const blogs = await blogModel
    .find()
    .populate({
      path: "publisher",
      select: "name email _id",
    })
    .skip(startIndex)
    .limit(limit)
    .sort({ [sortedBy]: order })
  // search blog by its title or content of body
  if (req.query.search) {
    const blogs = await blogModel
      .find({ $text: { $search: req.query.search } })
      .populate({
        path: "publisher",
        select: "name email _id",
      })
      .skip(startIndex)
      .limit(limit)
      .sort({ [sortedBy]: order })
    return res.status(200).json({
      numbOfBlogs: blogs.length,
      blogs: blogs,
    })({ numbOfBlogs: blogs.length, blogs: blogs })
  }

  if (!blogs) {
    return res.status(404).send("no blogs found")
  }
  res.status(200).json({
    numbOfBlogs: blogs.length,
    blogs: blogs,
  })
})
// get a specific blog
// @route /api/bloogy/blogs/:id
exports.getBlog = tryCatchHandler(async (req, res, next) => {
  const blog = await blogModel.findById(req.params.id).populate({
    path: "publisher",
    select: "name email _id",
  })

  if (!blog) {
    return next(
      new ErrorResponse(`blog not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).send(blog)
})
// create a blog
// @route /api/bloogy/blogs
exports.createBlog = tryCatchHandler(async (req, res, next) => {
  const newBlog = await blogModel.create(req.body)
  res.status(201).send(newBlog)
})
// modify a blog
// @route /api/bloogy/blogs/:id
exports.editBlog = tryCatchHandler(async (req, res, next) => {
  const blog = await blogModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!blog) {
    return next(
      new ErrorResponse(`blog not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).send(blog)
})
// delete a blog
// @route /api/bloogy/blogs/:id
exports.deleteBlog = tryCatchHandler(async (req, res, next) => {
  const blog = await blogModel.findByIdAndDelete(req.params.id)
  if (!blog) {
    return next(
      new ErrorResponse(`blog not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).send(blog)
})
