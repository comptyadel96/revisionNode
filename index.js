const express = require("express")
const app = express()
const dotEnv = require("dotenv")
const connectDatabase = require("./config/connectDatabase")
const errorHandler = require("./middleware/errors")
// config the env
dotEnv.config({ path: "./config/.env" })
// connect database
connectDatabase()
// all routes
const blogs = require("./routes/blogs")

// middleware to parse the body of the request to json format and store it in req.body object
app.use(express.json())

// mount the route


app.use("/api/bloogy", blogs)
app.use(errorHandler)
// app listening
const PORT = process.env.PORT || 5000
app.listen(PORT, console.log("app listening on port " + PORT))
