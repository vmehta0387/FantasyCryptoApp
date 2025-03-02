const axios = require("axios");
const Player = require("../models/Player");

const CRICBUZZ_API_KEY = process.env.RAPIDAPI_KEY; // Your RapidAPI key
const CRICBUZZ_HOST = "cricbuzz-cricket.p.rapidapi.com";

// Fetch players using Squad ID and store them in DB
exports.fetchAndStorePlayers = async (req, res) => {
    try {
        const { seriesId, squadId } = req.params;
        const options = {
            method: "GET",
            url: `https://cricbuzz-cricket.p.rapidapi.com/series/v1/${seriesId}/squads/${squadId}`,
            headers: {
                "x-rapidapi-key": CRICBUZZ_API_KEY,
                "x-rapidapi-host": CRICBUZZ_HOST
            },
        };

        const response = await axios.request(options);
        const players = response.data.player;

        let playerData = players
            .filter(p => !p.isHeader) // Ignore headers
            .map(p => ({
                playerId: p.id,
                squadId: squadId,
                teamId: req.body.teamId, // Must pass teamId in request body
                name: p.name,
                role: p.role,
                battingStyle: p.battingStyle || "",
                bowlingStyle: p.bowlingStyle || "",
                imageId: p.imageId || null,
            }));

        await Player.insertMany(playerData, { ordered: false }).catch(() => {}); // Ignore duplicate key errors

        res.json({ message: "Players stored successfully!", players: playerData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching players" });
    }
};

// Get stored players from DB
exports.getPlayersBySquad = async (req, res) => {
    try {
        const { squadId } = req.params;
        const players = await Player.find({ squadId: squadId });
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: "Error fetching players" });
    }
};
