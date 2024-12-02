
const mongoose = require("mongoose");

// Function to connect to MongoDB using tenant ID
const connectDB = async () => {
    try {
        
        await mongoose.connect("mongodb+srv://ranjithdevwemo2:ranjithdevwemo2@cluster0.3ckmctb.mongodb.net/HRPORTAL");
        // await mongoose.connect("mongodb://localhost:27017/HrPortal");
        console.log(`Connected to MongoDB. Tenant ID is /retail`);
    } catch (error) {
        console.error("Connection to MongoDB failed:", error.message);
        throw error; // Propagate the error for handling in the endpoint
    }
};

module.exports = connectDB;

