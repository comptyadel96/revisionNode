const { blogModel } = require("../models/blog")
// get all the blogs (Get method)
// @route /api/bloogy/blogs
exports.getBlogs = async (req, res, next) => {
  const blogs = await blogModel.find()
  if (!blogs) {
    return res.status(404).send("no blogs found")
  }
  res.status(200).json({
    numbOfBlogs: blogs.length,
    blogs: blogs,
  })
}
// get a specific blog (Get method)
// @route /api/bloogy/blogs/:id
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await blogModel.findById(req.params.id)
    if (!blog) {
      return res.status(404).send("blog not found")
    }
    res.status(200).send(blog)
  } catch (error) {
    res.status(404).send(error.message)
  }
}
// create a blog (Post method)
// @route /api/bloogy/blogs
exports.createBlog = async (req, res, next) => {
  const newBlog = await blogModel.create({ title: req.body.title })
  res.status(201).send(newBlog)
}
// modify a blog (Put method)
// @route /api/bloogy/blogs/:id
exports.editBlog = async (req, res, next) => {
  const blog = await blogModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!blog) {
    return res.status(404).send("blog not found")
  }
  res.status(200).send(blog)
}
// delete a blog (Delete method)
// @route /api/bloogy/blogs/:id
exports.deleteBlog = async (req, res, next) => {
  const blog = await blogModel.findByIdAndDelete(req.params.id)
  if (!blog) {
    return res.status(404).send("blog not found:it may be already deleted")
  }
  res.status(200).send(blog)
}
