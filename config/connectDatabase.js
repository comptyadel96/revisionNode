const mongoose = require('mongoose')

module.exports = connectDatabase = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI_DEV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log(`MongoDB Connected: ${conn.connection.host}`)
}
