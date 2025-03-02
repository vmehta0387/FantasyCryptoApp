import React, { useState } from "react";
import axios from "axios";
import './signup.css';
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  box-sizing:border-box;

  .MuiPaper-root {
    width: 100%;
    max-width: 400px;
    padding: 20px;
    text-align: center;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { username, email, password });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Error signing up: ", err);
    }
  };

  return (
    <>
      <div className="registertopbar">
        <EmojiEventsOutlinedIcon style={{ marginRight: '1vw' }} />
        <ArrowBackIcon style={{ marginRight: '15px', cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>DreamBet 11 -Register & Play</span>
      </div>
      <div class="register">
        <Paper className="MuiPaper-root">
          <h5 className="register-title">DreamBet 11 - Sign Up</h5>
          <div className="registerform">
            <TextField variant="outlined" fullWidth type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <TextField variant="outlined" fullWidth type="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <TextField variant="outlined" fullWidth type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button className="register-btn" onClick={handleSignup}>Signup</button>
          </div>
          <br />
          <div className="register-links">
            <Link to="/login">Already a user? Log in</Link>
          </div>
        </Paper>
      </div>
      {/* <div>
      <h2>Signup</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
    </div> */}
    </>
  );
};

export default Signup;
