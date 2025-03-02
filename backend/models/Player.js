const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
    playerId: { type: Number, required: true, unique: true },
    squadId: { type: Number, required: true },
    teamId: { type: Number, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    battingStyle: { type: String },
    bowlingStyle: { type: String },
    imageId: { type: Number },
});

module.exports = mongoose.model("Player", PlayerSchema);
