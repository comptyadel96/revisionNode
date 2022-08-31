const userModal = require("../models/user")
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const router = require("express").Router()

// serialize(from json data to a serie of strings) and deserialize user(from a serie of strings to a json data)
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  userModal.findById(id).then((user) => {
    done(null, user)
  })
})

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/shirty/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      let currentUser = await userModal.findOne({ userId: profile.id })
      // check if user exists in db or not if not create new user and save to db else return user from db to passport
      if (currentUser) {
        return cb(null, currentUser)
      } else {
        console.log(profile)
        const newUser = await userModal.create({
          userId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          authProvider: "google",
          profilPicture: profile.photos[0].value,
        })
        cb(null, newUser)
      }
    }
  )
)
router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
)
// handling the callback after google has authenticated the user
router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/profile",
  }),
  (req, res) => {
    console.log(req.user)
    res.send(req.user)
  }
)
//  route for successful logins
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).send(req.user)
  } else {
    res.status(404).send("no user connected with google account")
  }
})

// logout user from google strategy
router.get("/logout", (req, res) => {
  req.logout()
  req.session = null;
  res.redirect("http://localhost:3000/login")
  res.send("logout with success")
})

module.exports = router
