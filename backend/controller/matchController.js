const axios = require("axios");
const dotenv = require("dotenv");
const Match = require("../models/Match");

dotenv.config();

const CRICBUZZ_API_KEY = process.env.RAPIDAPI_KEY; // Your RapidAPI key
const CRICBUZZ_HOST = "cricbuzz-cricket.p.rapidapi.com";

// 🔄 Fetch Past Matches from Cricbuzz API
const fetchPastMatches = async () => {
    try {
      const response = await axios.get(`https://${CRICBUZZ_HOST}/matches/v1/recent`, {
        headers: {
          "x-rapidapi-key": CRICBUZZ_API_KEY,
          "x-rapidapi-host": CRICBUZZ_HOST
        }
      });
  
      const matches = response.data.typeMatches.flatMap(typeMatch =>
        typeMatch.seriesMatches.flatMap(series =>
          series.seriesAdWrapper?.matches?.map(match => ({
            matchId: match.matchInfo.matchId || null,
            seriesId: match.matchInfo.seriesId,
            seriesName: match.matchInfo.seriesName,
            matchDesc: match.matchInfo.matchDesc,
            matchFormat: match.matchInfo.matchFormat,
            startDate: match.matchInfo.startDate,
            endDate: match.matchInfo.endDate,
            status: match.matchInfo.status,
            team1: match.matchInfo.team1,
            team2: match.matchInfo.team2,
            venueInfo: match.matchInfo.venueInfo,
            matchType: "past"
          }))
        )
      );
  
      await Match.deleteMany({ matchType: "past" }); // Remove old past matches
      await Match.insertMany(matches);
      console.log(`✅ ${matches.length} Past Matches Updated`);
    } catch (err) {
      console.error("❌ Error Fetching Past Matches:", err.message);
    }
  };
  
  // 🔄 Fetch Upcoming Matches from Cricbuzz API
  const fetchUpcomingMatches = async () => {
    try {
      const response = await axios.get(`https://${CRICBUZZ_HOST}/schedule/v1/international`, {
        headers: {
          "x-rapidapi-key": CRICBUZZ_API_KEY,
          "x-rapidapi-host": CRICBUZZ_HOST
        }
      });
  
      const matches = response.data.matchScheduleMap.flatMap(schedule =>
        schedule.scheduleAdWrapper?.matchScheduleList.flatMap(series =>
          series.matchInfo.map(match => ({
            matchId: match.matchId || null,
            seriesId: match.seriesId,
            seriesName: series.seriesName,
            matchDesc: match.matchDesc,
            matchFormat: match.matchFormat,
            startDate: match.startDate,
            endDate: match.endDate,
            team1: match.team1,
            team2: match.team2,
            venueInfo: match.venueInfo,
            matchType: "upcoming"
          }))
        )
      );
  
      await Match.deleteMany({ matchType: "upcoming" }); // Remove old upcoming matches
      await Match.insertMany(matches);
      console.log(`✅ ${matches.length} Upcoming Matches Updated`);
    } catch (err) {
      console.error("❌ Error Fetching Upcoming Matches:", err.message);
    }
  };
  
  // ✅ Get Upcoming Matches
  const getUpcomingMatches = async (req, res) => {
    try {
      const upcomingMatches = await Match.find({ matchType: "upcoming" }).sort({ startDate: 1 });
      res.json(upcomingMatches);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // ✅ Get Past Matches
  const getPastMatches = async (req, res) => {
    try {
      const pastMatches = await Match.find({ matchType: "past" }).sort({ startDate: -1 });
      res.json(pastMatches);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = {
    fetchPastMatches,
    fetchUpcomingMatches,
    getUpcomingMatches,
    getPastMatches
  };