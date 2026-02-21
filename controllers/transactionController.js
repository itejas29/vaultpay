const mongoose = require("mongoose")
const Wallet = require("../models/Wallet")
const Transaction = require("../models/Transaction")
const User = require("../models/User")

// 🔹 Get All Transactions (Admin)
exports.getAllTransactions = async (req, res) => {
  try {
    const tx = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(100)

    res.json(tx)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

// 🔹 Get User History
exports.history = async (req, res) => {
  try {
    const tx = await Transaction.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(20)

    res.json(tx)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

// 🔹 Transfer Money
exports.transfer = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { receiverEmail, amount } = req.body
    const numericAmount = Number(amount)

    if (!numericAmount || numericAmount <= 0) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ msg: "Invalid amount" })
    }

    const senderUser = await User.findById(req.user.id).session(session)

    if (!senderUser) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ msg: "Sender not found" })
    }

    if (senderUser.isBlocked) {
      await session.abortTransaction()
      session.endSession()
      return res.status(403).json({ msg: "Account is frozen" })
    }

    const senderWallet = await Wallet.findOne({ user: req.user.id }).session(session)

    const normalizedEmail = receiverEmail.trim().toLowerCase()
    const receiverUser = await User.findOne({ email: normalizedEmail }).session(session)

    if (!receiverUser) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ msg: "Receiver not found" })
    }

    if (receiverUser._id.toString() === req.user.id) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ msg: "Cannot transfer to yourself" })
    }

    const receiverWallet = await Wallet.findOne({ user: receiverUser._id }).session(session)

    if (!senderWallet || !receiverWallet) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ msg: "Wallet not found" })
    }

    if (senderWallet.balance < numericAmount) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ msg: "Insufficient funds" })
    }

    senderWallet.balance -= numericAmount
    receiverWallet.balance += numericAmount

    await senderWallet.save({ session })
    await receiverWallet.save({ session })

    const flagged = numericAmount > 50000

    await Transaction.create([{
      sender: req.user.id,
      receiver: receiverUser._id,
      amount: numericAmount,
      flagged
    }], { session })

    await session.commitTransaction()
    session.endSession()

    res.json({
      msg: "Transfer successful",
      flagged
    })

  } catch (err) {
    console.error("TRANSFER ERROR:", err)
    await session.abortTransaction()
    session.endSession()
    res.status(500).json({ msg: err.message })
  }
}

// 🔹 Preview Receiver
exports.previewReceiver = async (req, res) => {
  try {
    const { receiverEmail } = req.body

    if (!receiverEmail)
      return res.status(400).json({ msg: "Email required" })

    const normalizedEmail = receiverEmail.trim().toLowerCase()

    const user = await User.findOne({ email: normalizedEmail })

    if (!user)
      return res.status(404).json({ msg: "User not found" })

    res.json({
      name: user.name,
      email: user.email
    })

  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}