const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");


const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        let userName = await User.findOne({username});
        if(userName) return res.status(400).json({msg: "Username already taken!"});

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ email, password: hashedPassword, username });

        await user.save();
        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, "SECRET_KEY", { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, email: user.email, name: user.name , username: user.username } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getUserDetails = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select("-password"); // Password hata ke send kar raha hu
      if (!user) return res.status(404).json({ error: "User not found" });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

module.exports = { loginUser, signUp, getUserDetails };
