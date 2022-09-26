const ErrorResponse = require("../utils/errorsResponse")
// custom middleware to handle errors and send them to the client in a json format
const errorHandler = (err, req, res, next) => {
  console.log(err)
  let error = { ...err } // to avoid manipulating the original error object
  error.message = err.message // get the message from the error object
  let customMessage
  // if the user enter un bad object id
  if (err.name === "CastError") {
    customMessage = `incorrect id: ${error.value}, please use a correct format`
    error = new ErrorResponse(customMessage, 400)
  }
  // if the user enter a duplicate field value for title or description
  if (err.code === 11000) {
    const { title, description } = error.keyValue
    if (title && !description) {
      customMessage = `le titre: ${title} existe déja`
    } else if (!title && description) {
      customMessage = `la description: ${description} existe déja veuillez choisir une autre`
    }

    error = new ErrorResponse(customMessage, 400)
  }
  // if the user does not provide required infos
  if (err.name === "ValidationError") {
    customMessage = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(customMessage, 400)
  }
  res.status(error.statusCode || 500).json({ error: error.message })
}
module.exports = errorHandler
