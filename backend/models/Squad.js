const mongoose = require("mongoose");

const SquadSchema = new mongoose.Schema({
    squadId: { type: Number, required: true, unique: true },
    teamId: { type: Number, required: true },
    seriesId: { type: Number, required: true },
    teamName: { type: String, required: true },
    imageId: { type: Number },
});

module.exports = mongoose.model("Squad", SquadSchema);