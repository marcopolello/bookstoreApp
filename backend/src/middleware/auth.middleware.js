import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

/* 
    example of request: 
    const reponse = await fetch ( "http://localhost:5001/api/books", {
        method: "POST",
        body: JSON.stringify({title, author, caption, description, price, image, category, rating, countInStock}),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
*/

export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']; // Correctly access the Authorization header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "access denied" });
        }

        const token = authHeader.replace("Bearer ", "");

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user (select all user fields except password)
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) return res.status(401).json({ message: "token is not valid" });

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware", error.message);
        res.status(401).json({ message: "token is not valid" });
    }
};

export default protectRoute;