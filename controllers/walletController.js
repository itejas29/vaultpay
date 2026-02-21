const Wallet = require("../models/Wallet")

exports.getBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id })

    if (!wallet) {
      return res.json({ balance: 0 })
    }

    res.json({ balance: wallet.balance })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

exports.addMoney = async (req, res) => {
    const { amount } = req.body
    const wallet = await Wallet.findOne({ user: req.user.id })

    wallet.balance += amount
    await wallet.save()

    res.json({ msg: "Money added", balance: wallet.balance })
}