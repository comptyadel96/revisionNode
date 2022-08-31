function isAuthentificated(req, res, next) {
  if (req.user) {
    console.log("user is authenticated")
    next()
  } else {
    res.redirect("localhost:3000/login")
    console.log("user not authenticated")
  }
}
module.exports = { isAuthentificated }
