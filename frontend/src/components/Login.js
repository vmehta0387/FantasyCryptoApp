import React, { useState } from "react";
import axios from "axios";
import './login.css';
import styled from '@emotion/styled';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/home");
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="logintopbar">
        <EmojiEventsOutlinedIcon style={{ marginRight: '1vw' }} />
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>DreamBet 11 - Your Crypto Fantasy App</span>
      </div>
      <div className="login">

        <Paper className="login-container">
          <h5>Please install Metamask plugin and switch to Polygon Amoy</h5>
          <h5 className="login-title">LOG IN & PLAY</h5>
          <div className="login-form">
            <TextField fullWidth variant="outlined" type="email" className="input-field" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <TextField fullWidth variant="outlined" type="password" className="input-field" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button className="login-btn" variant="contained" disableElevation onClick={handleLogin}>Login</button>
          </div>

          <div className="login-links">
            <Link to="/signup" className="link">Don't have an account? Sign up</Link>
          </div>
        </Paper>
      </div>


    </>
  );
};

export default Login;
