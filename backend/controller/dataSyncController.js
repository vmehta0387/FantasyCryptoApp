const axios = require("axios");
const Match = require("../models/Match");
const Squad = require("../models/Squad");
const Player = require("../models/Player");

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; 
const RAPIDAPI_HOST = "cricbuzz-cricket.p.rapidapi.com";

// 🔥 Main function to fetch squads & players for all series
exports.syncSquadsAndPlayers = async (req, res) => {
    try {
        // Step 1: Get unique series IDs from matches DB
        const seriesIds = await Match.distinct("seriesId", { matchType: "upcoming" });
        console.log(`Found unique series: ${seriesIds}`);

        for (const seriesId of seriesIds) {
            console.log(`Fetching squads for Series ID: ${seriesId}`);

            // Step 2: Fetch squads for each series
            const squadOptions = {
                method: "GET",
                url: `https://${RAPIDAPI_HOST}/series/v1/${seriesId}/squads`,
                headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": RAPIDAPI_HOST },
            };

            const squadResponse = await axios.request(squadOptions);
            const squads = squadResponse.data.squads;

            for (const squad of squads) {
                
                if (!squad.teamId) continue; // Skip headers

                // Step 3: Store Squad in DB
                await Squad.updateOne(
                    { squadId: squad.squadId },
                    {
                        $set: {
                            squadId: squad.squadId,
                            teamId: squad.teamId,
                            seriesId: seriesId,
                            teamName: squad.squadType,
                            imageId: squad.imageId || null,
                        },
                    },
                    { upsert: true }
                );

                console.log(`Squad stored: ${squad.teamId} - ${squad.squadType}`);

                
                // Step 4: Fetch players for each squad
                console.log(`Fetching players for Squad ID: ${squad.squadId}`);
                const playerOptions = {
                    method: "GET",
                    url: `https://${RAPIDAPI_HOST}/series/v1/${seriesId}/squads/${squad.squadId}`,
                    headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": RAPIDAPI_HOST },
                };

                const playerResponse = await axios.request(playerOptions);
                const players = playerResponse.data.player;

                for (const player of players) {
                    if (player.isHeader) continue; // Skip headers

                    // Step 5: Store Player in DB
                    await Player.updateOne(
                        { playerId: player.id },
                        {
                            $set: {
                                playerId: player.id,
                                squadId: squad.squadId,
                                teamId: squad.teamId,
                                name: player.name,
                                role: player.role,
                                battingStyle: player.battingStyle || "",
                                bowlingStyle: player.bowlingStyle || "",
                                imageId: player.imageId || null,
                            },
                        },
                        { upsert: true }
                    );

                    console.log(`Player stored: ${player.name} - ${player.role}`);
                }
            }
        }

        res.json({ message: "Squads and Players synchronized successfully!" });
    } catch (error) {
        console.error("Error in syncing squads and players:", error);
        res.status(500).json({ error: "Error in syncing squads and players" });
    }
};
