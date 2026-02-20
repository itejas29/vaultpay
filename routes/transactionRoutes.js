const router = require("express").Router()
const auth = require("../middleware/auth")
const role = require("../middleware/role")

const {
  transfer,
  history,
  getAllTransactions
} = require("../controllers/transactionController")

router.post("/transfer", auth, transfer)

router.get("/history", auth, history)

router.get("/all", auth, role("admin"), getAllTransactions)

module.exports = router