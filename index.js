const express = require("express")
const { cloudinaryConfig } = require("./middleware/cloudinaryConfig")
const app = express()
const dotEnv = require("dotenv")
const connectDatabase = require("./config/connectDatabase")
const errorHandler = require("./middleware/errors")
const cookieSession = require("cookie-session")
const passport = require("passport")
const cors = require("cors")
const bodyParser = require("body-parser")
// config the env
dotEnv.config({ path: "./config/.env" })
// connect database
connectDatabase()
// all routes
const shirts = require("./routes/shirts")
const auth = require("./routes/googleAuth")
const facebookAuth = require("./routes/facebookAuth")
const adminShirt = require("./routes/adminShirt")
const sweat = require("./routes/sweats")

// use cookie session to store the session in the browser
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in miliseconds
    keys: [process.env.COOKIE_KEY], // key to encrypt the cookie
    secure: false,
    httpOnly: false,
  })
)
app.use(passport.initialize()) // initialize passport
app.use(passport.session()) // use the cookie to store the session
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
)
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  )

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type")

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true)

  // Pass to next layer of middleware
  next()
})
// serve static images
app.use(express.static(__dirname + "/public"))
// middleware to parse the body of the request to json format and store it in req.body object
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: "15mb" }))
app.use(express.json({ limit: "15mb" })) // limit the size of the body of the request to 500kb
app.use(cloudinaryConfig) // configure cloudinary with your own account details and environment variables

app.use("/api/shirty/auth/google", auth) // mount the google auth routes
app.use("/api/shirty/auth/facebook", facebookAuth) // mount the facebook auth route
// mount the routes
app.use("/api/shirty", shirts)
app.use("/api/admin", adminShirt)
app.use("/api/shirty", sweat)
app.use(errorHandler)
// app listening
const PORT = process.env.PORT || 5000
app.listen(PORT, console.log("app listening on port " + PORT))
