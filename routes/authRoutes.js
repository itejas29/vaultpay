const router = require("express").Router()
const { register, login } = require("../controllers/authController")
const rateLimiter = require("../middleware/rateLimiter")

router.post("/register", rateLimiter, register)
router.post("/login", rateLimiter, login)

module.exports = router