const { config, uploader } = require("cloudinary").v2 // import cloudinary functions

// Configure cloudinary with your own account details and environment variables
// open free account at https://cloudinary.com/
const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  next()
}
module.exports = { cloudinaryConfig, uploader }
