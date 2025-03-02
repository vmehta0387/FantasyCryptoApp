const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  matchId: Number,
  seriesId: Number,
  seriesName: String,
  matchDesc: String,
  matchFormat: String,
  startDate: Number,
  endDate: Number,
  status: String,
  team1: {
    teamId: Number,
    teamName: String,
    teamSName: String,
    imageId: Number,
  },
  team2: {
    teamId: Number,
    teamName: String,
    teamSName: String,
    imageId: Number,
  },
  venueInfo: {
    ground: String,
    city: String,
    timezone: String,
  },
  matchType: String, // "past" or "upcoming"
});

module.exports = mongoose.model("Match", MatchSchema);
