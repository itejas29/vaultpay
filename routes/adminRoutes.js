const router = require("express").Router()
const auth = require("../middleware/auth")
const role = require("../middleware/role")
const User = require("../models/User")

// ===============================
// Get all users (Admin only)
// ===============================
router.get("/users", auth, role("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})


// ===============================
// Freeze user account
// ===============================
router.put("/freeze/:id", auth, role("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user)
      return res.status(404).json({ msg: "User not found" })

    user.isBlocked = true
    await user.save()

    res.json({ msg: "User account frozen" })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})


// ===============================
// Unfreeze user account
// ===============================
router.put("/unfreeze/:id", auth, role("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user)
      return res.status(404).json({ msg: "User not found" })

    user.isBlocked = false
    await user.save()

    res.json({ msg: "User account unfrozen" })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

module.exports = router