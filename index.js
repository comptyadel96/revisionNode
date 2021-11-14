const express = require("express")
const app = express()
const dotEnv = require("dotenv")
const connectDatabase = require("./config/connectDatabase")
const errorHandler = require("./middleware/errors")
const cookieSession = require("cookie-session")
const passport = require("passport")

// config the env
dotEnv.config({ path: "./config/.env" })

// connect database
connectDatabase()
// all routes
const blogs = require("./routes/blogs")
const auth = require("./routes/googleAuth")

// middleware to parse the body of the request to json format and store it in req.body object
app.use(express.json())

// mount the routes
app.use("/api/bloogy", blogs)
app.use(errorHandler)
// use cookie session to store the session in the browser
app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [process.env.COOKIE_KEY],
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())
  
app.use("/api/bloogy/auth", auth)

// app listening
const PORT = process.env.PORT || 5000
app.listen(PORT, console.log("app listening on port " + PORT))
