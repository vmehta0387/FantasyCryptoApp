const express = require("express");
const { getUpcomingMatches } = require("../controller/sportsController.js");
const { getLiveMatches } = require("../controller/sportsController.js");

const router = express.Router();

router.get("/upcomingMatches", getUpcomingMatches); // ✅ Fetch Upcoming Matches
router.get("/liveMatches", getLiveMatches); // ✅ Fetch Live Matches


module.exports = router;