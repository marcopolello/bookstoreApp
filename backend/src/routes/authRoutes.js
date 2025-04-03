import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });
const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        if(username.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters" });
        }

        //check if user already exist
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exist" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exist" });
        }

        //get random avatar
        const profileImage = `https://api.dicebear.com/9.x/bottts/svg?seed=${username}`;

        const user = new User({ username, email, password, profileImage });

        await user.save();

        const token = generateToken(user._id);


        res.status(201).json({ 
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            } 
        });

    } catch (error) {
        console.log("Error in register route", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "All fields are required" });

        //check if user exist
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        //check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        //generate token
        const token = generateToken(user._id);

        res.status(200).json({ 
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            } 
        });

    } catch (error) {
        console.log("Error in login route", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;