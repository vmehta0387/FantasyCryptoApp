const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    userAddress: { type: String, required: true },
    type: { type: String, enum: ["deposit", "withdraw"], required: true },
    amount: { type: Number, required: true },
    txHash: { type: String, required: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Transaction", TransactionSchema);