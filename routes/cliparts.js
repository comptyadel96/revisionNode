const router = require("express").Router()
const { getclipart, createClipart } = require("../controllers/clipart")
router.route("/").get(getclipart).post(createClipart)
module.exports = router
