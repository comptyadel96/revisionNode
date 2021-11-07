const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: [100, 'Title must be less than 100 characters'],
    minlength: [5, 'Title must be at least 5 or more characters'],
  },
  photo: {
    type: String,
    default:"not-upload"
  },
  description: {
    type: String,
    minlength: [20, 'Description must be at least 20 or more characters'],
    maxlength: [2000, 'Description must be less than 2000 characters'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      //   required: true
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
      //   required: true
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const blogModel = mongoose.model('blog', blogSchema)

module.exports = { blogSchema, blogModel }