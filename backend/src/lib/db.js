import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to MongoDB ${connection.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with an error code
    }
};
