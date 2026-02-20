const Wallet = require("../models/Wallet")

exports.getBalance = async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.user.id })
  res.json({ balance: wallet.balance })
}

exports.addMoney = async (req, res) => {
    const { amount } = req.body
    const wallet = await Wallet.findOne({ user: req.user.id })

    wallet.balance += amount
    await wallet.save()

    res.json({ msg: "Money added", balance: wallet.balance })
}