function isAuthentificated(req, res, next) {
  if (req.user) {
    next()
  } else {
    // res.redirect("localhost:3000/login")
    res.status(403).send("vous devez vous connecter pour accéder à ce contenu")
  }
}
module.exports = { isAuthentificated }
