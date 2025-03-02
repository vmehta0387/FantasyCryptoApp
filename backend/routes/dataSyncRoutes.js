const express = require("express");
const router = express.Router();
const dataSyncController = require("../controller/dataSyncController");

router.get("/sync", dataSyncController.syncSquadsAndPlayers);

module.exports = router;