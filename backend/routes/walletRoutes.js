const express = require("express");
const { connectWallet, getBalance, depositDBC, withdrawDBC } = require("../controller/walletController");

const router = express.Router();

router.post("/connect-wallet", connectWallet);
router.get("/get-balance/:address", getBalance);
router.post("/deposit", depositDBC);
router.post("/withdraw", withdrawDBC);

module.exports = router;