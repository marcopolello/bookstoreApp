import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./lib/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(5001, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});