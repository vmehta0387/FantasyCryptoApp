const express = require("express");
const router = express.Router();
const playerController = require("../controller/playerController");

router.post("/fetch/:seriesId/:squadId", playerController.fetchAndStorePlayers);
router.get("/get/:squadId", playerController.getPlayersBySquad);

module.exports = router;
