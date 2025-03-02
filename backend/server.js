require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const sportsRoutes = require("./routes/sportRoutes.js");
const matchRoutes = require("./routes/matchRoutes.js")

const playerRoutes = require("./routes/playerRoutes");
const dataSyncRoutes = require("./routes/dataSyncRoutes");
const { fetchPastMatches, fetchUpcomingMatches } = require("./controller/matchController");

const dataSyncController = require("./controller/dataSyncController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/wallet", walletRoutes);
app.use("/api/sports", sportsRoutes);
app.use("/api/matches", matchRoutes);

app.use("/api/player", playerRoutes);
app.use("/api/data", dataSyncRoutes);


fetchPastMatches();
fetchUpcomingMatches();

 // ✅ Auto-sync squads & players on server start
 console.log("🚀 Running initial squad & player sync...");
 dataSyncController.syncSquadsAndPlayers()
     .then(() => console.log("✅ Initial sync completed!"))
     .catch((err) => console.error("❌ Error in initial sync:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));
