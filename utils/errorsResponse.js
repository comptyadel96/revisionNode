// custom class for errors response from server  (for example: 404, 500, etc, and custom message)
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

module.exports = ErrorResponse
