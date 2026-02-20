const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    status: { type: String, default: "success" },
    flagged: { type: Boolean, default: false }
}, { timestamps: true })

transactionSchema.index({ sender: 1 })
transactionSchema.index({ createdAt: -1 })

module.exports = mongoose.model("Transaction", transactionSchema)