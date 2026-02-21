const router = require("express").Router()
const auth = require("../middleware/auth")
const role = require("../middleware/role")

const transactionController = require("../controllers/transactionController")

router.post("/transfer", auth, transactionController.transfer)

router.post("/preview", auth, transactionController.previewReceiver)

router.get("/history", auth, transactionController.history)

router.get(
  "/all",
  auth,
  role("admin"),
  transactionController.getAllTransactions
)

module.exports = router