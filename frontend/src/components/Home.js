import './home.css';
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import SportsCricketOutlinedIcon from '@mui/icons-material/SportsCricketOutlined';
import { Button, Container, Typography, Card, CardContent, Grid, CircularProgress, Box, Tab, Tabs } from "@mui/material";
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import contractABI from '../config/dbcAbi';

const contractAddress = "0x462A2aCb9128734770A3bd3271276966ad6fc22C";



const Home = () => {

    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [matches, setMatches] = useState([]);
    const [liveMatches, setLiveMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [networkError, setNetworkError] = useState("");
    const [user, setUser] = useState(null);
    const [countdowns, setCountdowns] = useState({});

    const navigate = useNavigate();

    // ✅ Initialize Web3 on Load
    useEffect(() => {
        checkSession();
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
        } else {
            console.log("MetaMask not installed!");
        }

        // ✅ Call fetchLiveMatches() on load
        if (account) {

            fetchUpcomingMatches();
            fetchLiveMatches();
        }
    }, [account]); // Runs when account changes (connects to MetaMask)

    // ✅ Wallet Connect Function
    const connectWallet = async () => {
        try {
            setLoading(true);
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]);
                const chainId = await web3.eth.getChainId();
                //console.log("chain id: ",parseInt(chainId, 16));
                if (parseInt(chainId, 16) !== 524290) {
                    // ⚠ Polygon Amoy Testnet ka Chain ID 80002 hai
                    setNetworkError("Please switch to Polygon Amoy Testnet.");
                    alert("⚠ Error: Please switch to Polygon Amoy Testnet.");
                } else {
                    setNetworkError("");
                    fetchBalance(accounts[0]); // Fetch balance after wallet connection

                }


            } else {
                console.log("Please install MetaMask");
            }
        } catch (error) {
            console.log("Error connecting wallet:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch DBC Token Balance
    const fetchBalance = async (address) => {
        if (web3) {
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const balance = await contract.methods.balanceOf(address).call();
            setBalance(web3.utils.fromWei(balance, "ether"));
        }
    };



    // ✅ Fetch Live Cricket Matches from SportsMonk
    const fetchUpcomingMatches = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/matches/upcoming');
            setMatches(response.data);

        } catch (error) {
            console.error("Error fetching matches:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLiveMatches = async () => {

        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/matches/past');
            setLiveMatches(response.data);


        } catch (error) {
            console.error("Error fetching matches:", error);
        } finally {
            setLoading(false);
        }

    };

    const checkSession = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                //console.log("Token:", token);
                const response = await axios.get("http://localhost:5000/api/auth/profile", {
                    headers: { Authorization: token }
                });
                setUser(response.data);
            }

            catch (error) {
                console.log("Session expired, logging out...");
                localStorage.removeItem("token");
                setUser(null);
            }
        }
        else {
            navigate("/login");
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            updateCountdowns();
        }, 1000);
        return () => clearInterval(interval);
    }, [matches]);
    const updateCountdowns = () => {
        const now = new Date().getTime();
        const newCountdowns = {};
        matches.forEach(match => {
            const matchTime = new Date(match.startDate).getTime();
            const diff = matchTime - now;
            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                newCountdowns[match.matchId] = `${hours}h ${minutes}m ${seconds}s`;
            } else {
                newCountdowns[match.matchId] = "Match Started";
            }
        });
        setCountdowns(newCountdowns);
    };


    const handleLogout = () => {
        localStorage.removeItem("token"); // 🔥 Token remove
        navigate("/login"); // 🔥 Login page pe redirect
    };

    return (
        <Container maxWidth="md" sx={{ padding: "20px" }}>
            <div className="hometopbar">
                <EmojiEventsOutlinedIcon style={{ marginRight: '1vw' }} />
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>DreamBet 11 - Your Crypto Fantasy App</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', marginLeft: '12vw' }}>{user && <u>Welcome, {user.username}</u>}</span>
                <LogoutIcon style={{ marginRight: '1vw' }} onClick={handleLogout} />
            </div>
            <br />
            {!account ? (
                <Button variant="contained" color="primary" onClick={connectWallet} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Connect MetaMask"}

                </Button>

            ) : (
                <>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <Typography variant="title" align="left"><span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#73c6b6' }}>Connected Wallet:</span>
                            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#d98880' }}> {account}</span></Typography>
                        <Typography variant="title" color="inherit" noWrap>&nbsp;</Typography>
                        <Typography variant="title" align="right"><span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#73c6b6' }}>(Testnet) DBC Balance: </span>
                            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#d98880' }}>{balance ? balance : "{Loading...}"} DBC </span></Typography>
                    </Box>
                    <br />
                    <div>
                        <Tabs value={activeTab} textColor="primary" indicatorColor="secondary" onChange={(e, newValue) => setActiveTab(newValue)} centered>
                            <Tab label="Upcoming Matches" sx={{ width: '180px', textTransform: 'none', fontFamily: 'Georgia, serif', fontSize: '14px', color: 'blue' }} />
                            <Tab label="Current Matches" sx={{ width: '180px', textTransform: 'none', fontFamily: 'Georgia, serif', fontSize: '14px', color: 'green' }} />
                            <Tab label="My Matches" sx={{ width: '180px', textTransform: 'none', fontFamily: 'Georgia, serif', fontSize: '14px', color: 'purple' }} />
                        </Tabs>
                    </div>

                    {/* Conditional rendering based on activeTab */}
                    {activeTab === 0 && (
                        <div className="upcomingmatches">
                            <br />
                            {loading ? (
                                <CircularProgress size={50} />
                            ) : (
                                <Grid container spacing={3}>
                                    {matches.length === 0 ? (
                                        <Typography variant="h6" align="center">No upcoming matches</Typography>
                                    ) : (
                                        matches.map((match) => (
                                            <Grid item xs={12} md={6} key={match.matchId}>
                                                <Card sx={{ padding: "10px", boxShadow: 3 }}>
                                                    <CardContent>


                                                        <Typography variant="caption" color="warning" gutterBottom>
                                                            {match.seriesName} - {match.matchDesc}</Typography>
                                                        <Typography variant="body2" color="primary" sx={{ p: "5px", mt: "5px" }} gutterBottom>
                                                            <SportsCricketOutlinedIcon
                                                                style={{
                                                                    color: '#595959',
                                                                    fontSize: '20px',
                                                                    marginLeft: '1px',
                                                                    fontWeight: '200',
                                                                }}
                                                            />
                                                            <strong> {match.team1.teamName}</strong> vs <strong>{match.team2.teamName}</strong>
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                                            <b>Match Date:</b> {new Date(match.startDate).toLocaleString()}
                                                        </Typography>
                                                        <Typography variant="body2" color="success" gutterBottom>
                                                            {countdowns[match.matchId] || "Calculating..."}
                                                        </Typography>
                                                        <Typography variant="body2" color="warning" gutterBottom>
                                                            Contest Entry Fee: 10 DBC
                                                        </Typography>
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            fullWidth
                                                            sx={{ marginTop: "10px" }}
                                                        >
                                                            Join Contest
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))
                                    )}
                                </Grid>
                            )}
                        </div>
                    )}

                    {activeTab === 1 && (
                        <div className="livematches">
                            <br />
                            {loading ? (
                                <CircularProgress size={50} />
                            ) : (
                                <Grid container spacing={3}>
                                    {liveMatches.length === 0 ? (
                                        <Typography variant="h6" align="center">No Current matches</Typography>
                                    ) : (
                                        liveMatches.map((match) => (
                                            <Grid item xs={12} md={6} key={match.matchId}>
                                                <Card sx={{ padding: "10px", boxShadow: 3 }}>
                                                    <CardContent>

                                                        <Typography variant="caption" color="warning" gutterBottom>

                                                            {match.seriesName} - {match.matchDesc}</Typography>
                                                        <Typography variant="body2" color="primary" sx={{ p: "5px", mt: "5px" }} gutterBottom>
                                                            <SportsCricketOutlinedIcon
                                                                style={{
                                                                    color: '#595959',
                                                                    fontSize: '20px',
                                                                    marginLeft: '1px',
                                                                    fontWeight: '200',
                                                                }}
                                                            />

                                                            <strong> {match.team1.teamName}</strong> vs <strong>{match.team2.teamName}</strong>
                                                        </Typography>

                                                        <Typography variant="body2" color="textSecondary" sx={{ p: "5px", mt: "5px" }} gutterBottom>
                                                            <b>Date: </b>{new Date(parseInt(match.startDate)).toLocaleString()}
                                                        </Typography>

                                                        <Typography variant="subtitle2" color="success" sx={{ p: "5px", mt: "5px" }} gutterBottom>
                                                            <b>{match.status}</b>
                                                        </Typography>

                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))
                                    )}
                                </Grid>
                            )}
                        </div>
                    )}

                    {activeTab === 2 && (
                        <div className="mymatches">
                            <br />
                            {/* Render your "My Matches" content here */}
                        </div>
                    )}

                </>
            )}
        </Container>
    );


}

export default Home;