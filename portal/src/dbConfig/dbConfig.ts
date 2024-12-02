

import mongoose from "mongoose";

// Flag to track database connection status
let isConnected = false;

export async function connect() {
    const MONGO_URI = "mongodb+srv://ranjithdevwemo2:ranjithdevwemo2@cluster0.3ckmctb.mongodb.net/HRPORTAL";
    // const MONGO_URI = "mongodb://localhost:27017/HrPortal";

    if (isConnected) {
        console.log("Already connected to the database.");
        return;
    }

    try {
        // Establish MongoDB connection
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to the database.");
    }
}
