const express = require("express");
const router = express.Router();
const { getUpcomingMatches, getPastMatches } = require("../controller/matchController");

router.get("/upcoming", getUpcomingMatches);
router.get("/past", getPastMatches);

module.exports = router;
