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
      callbackURL: "http://localhost:5000/api/bloogy/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      let currentUser = await userModal.findOne({ googleId: profile.id })
      // check if user exists in db or not if not create new user and save to db else return user from db to passport
      if (currentUser) {
        return cb(null, currentUser)
      } else {
        const newUser = await userModal.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilPicture: profile.photos[0].value,
        })
        cb(null, newUser)
      }
    }
  )
)
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
)
// handling the callback after google has authenticated the user
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  console.log(req.user)
  res.send("succesfully redirected")
})

// test authentication with google strategy and passport
router.get("/current-user", async (req, res) => {
  console.log(req.user)
  res.send(req.user)
})
// logout user from google strategy
router.get("/logout", (req, res) => {
  req.logout()
  res.send("logout")
})
router.get("/test", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("user is authenticated")
  } else {
    res.send("user is not authenticated")
  }
})

module.exports = router
