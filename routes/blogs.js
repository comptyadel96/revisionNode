const router = require("express").Router()
const {
  getBlogs,
  getBlog,
  createBlog,
  deleteBlog,
  editBlog,
} = require("../controllers/blogs")
// Public routes
router.route("/blogs").get(getBlogs).post(createBlog)
// Private routes (need authentification)
router.route("/blogs/:id").get(getBlog).put(editBlog).delete(deleteBlog)

module.exports = router
