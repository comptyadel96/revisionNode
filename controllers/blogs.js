const { blogModel } = require("../models/blog")
const ErrorResponse = require("../utils/errorsResponse")
const tryCatchHandler = require("../middleware/tryCatchHandler")
// get all the blogs
// @route /api/bloogy/blogs
exports.getBlogs = tryCatchHandler(async (req, res, next) => {
  const blogs = await blogModel.find()
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
  const blog = await blogModel.findById(req.params.id)
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
