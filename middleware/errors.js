const errorHandler = ( req, res, next) => {
  console.log("fired")
  next()
}
module.exports = errorHandler
