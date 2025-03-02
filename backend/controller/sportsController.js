const axios =  require("axios");
const dotenv = require("dotenv");

dotenv.config();

const CRICAPI_KEY = process.env.CRICKETDATA_API_KEY; // Use your CricAPI Key

// ✅ Fetch Matches + Team Names + Date/Time + Match Type + Series Name
const getUpcomingMatches = async (req, res) => {
  try {
    const fixturesResponse = await axios.get(
      `https://api.cricapi.com/v1/matches?apikey=${CRICAPI_KEY}&offset=0`
    );

    console.log("CricAPI Response:", fixturesResponse.data); // Debug API Response

    if (!fixturesResponse.data || !fixturesResponse.data.data || !Array.isArray(fixturesResponse.data.data)) {
      return res.status(500).json({ success: false, error: "Invalid API response format" });
    }

    const matches = fixturesResponse.data.data;

    // 🔹 Get Current Date & Time
    const now = new Date();

    // 🔹 Filter Future Matches & Sort by Date
    const upcomingMatches = matches
      .filter((match) => new Date(match.dateTimeGMT) > now) // ✅ Remove past matches
      .map((match) => ({
        id: match.id,
        matchName: match.name, // ✅ Match Name
        team1: match.teams[0],
        team2: match.teams[1],
        matchType: match.matchType || "Unknown", // ✅ Match Type (ODI, T20, Test)
        venue: match.venue || "Unknown Venue", // ✅ Venue
        matchDateTime: match.dateTimeGMT, // ✅ Match Date & Time
        entryFee: 10, // ✅ Example Entry Fee (in DBC) 
      }))
      .sort((a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime)); // ✅ Sort by Date & Time

    res.json({ success: true, matches: upcomingMatches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ success: false, error: "Failed to fetch matches" });
  }
};

const getLiveMatches = async (req, res) => {
  try {
    const liveResponse = await axios.get(
      `https://api.cricapi.com/v1/currentMatches?apikey=${CRICAPI_KEY}&offset=0`
    );

    console.log("CricAPI Live Matches Response:", liveResponse.data); // Debugging

    if (!liveResponse.data || !liveResponse.data.data || !Array.isArray(liveResponse.data.data)) {
      return res.status(500).json({ success: false, error: "Invalid API response format" });
    }

    const matches = liveResponse.data.data;

    // 🔹 Filter only live matches
    const liveMatches = matches
      .filter((match) => match.matchStarted) // ✅ Ongoing matches only
      .map((match) => ({
        id: match.id,
        matchName: match.name, // ✅ Match Name
        team1: match.teams[0],
        team2: match.teams[1],
        matchType: match.matchType || "Unknown", // ✅ Match Type
        venue: match.venue || "Unknown Venue", // ✅ Venue
        status: match.status || "Unknown", // ✅ Live Status (e.g., "New Zealand won by 2 wkts")
        matchDateTime: match.dateTimeGMT, // ✅ Match Date & Time
        score: Array.isArray(match.score) ? match.score : [], // ✅ Score details
      }));

    res.json({ success: true, matches: liveMatches });
  } catch (error) {
    console.error("Error fetching live matches:", error);
    res.status(500).json({ success: false, error: "Failed to fetch live matches" });
  }
};


module.exports = { getUpcomingMatches, getLiveMatches }