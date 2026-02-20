const router = require("express").Router()
const auth = require("../middleware/auth")
const { getBalance, addMoney } = require("../controllers/walletController")

// Get wallet balance
router.get("/balance", auth, getBalance)

// Add money to wallet
router.post("/add", auth, addMoney)

module.exports = router