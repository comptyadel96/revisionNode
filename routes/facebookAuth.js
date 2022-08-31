const userModal = require("../models/user")
const passport = require("passport")
const FacebookStrategy = require("passport-facebook").Strategy
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
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/shirty/auth/facebook/callback",
      profileFields: ["id", "displayName", "email", "picture.type(large)"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      let currentUser = await userModal.findOne({ userId: profile.id })
      // check if user exists in db or not if not create new user and save to db else return user from db to passport
      if (currentUser) {
        return cb(null, currentUser)
      } else {
        const newUser = await userModal.create({
          userId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          authProvider: "facebook",
          profilPicture: profile.photos[0].value,
        })
        cb(null, newUser)
      }
    }
  )
)

router.get(
  "/",
  passport.authenticate("facebook", {
    scope: ["email"],
  })
)
// handling the callback after facebook has authenticated the user
router.get(
  "/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:3000/profile",
  }),
  (req, res) => {
    if (req.user) {
      res.status(200).send(req.user)
      // console.log(req.user)
    } else {
      res.status(404).send("no user connected")
    }
  }
)
//  route for successful logins
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).send(req.user)
  } else {
    res.status(404).send("no user connected with facebook account")
  }
})
// logout user from facebook strategy
router.get("/logout", (req, res) => {
  req.logout()
  req.session = null
  res.redirect("http://localhost:3000/login")
  res.send("logout with success")
})
// router.get("/isAuthenticated", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send("user is authenticated")
//   } else {
//     res.send("user is not authenticated")
//   }
// })

module.exports = router
