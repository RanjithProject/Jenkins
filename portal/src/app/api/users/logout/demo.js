analys this model and add cart object or Array


import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email address"],
        unique: true,
        lowercase: true,  // Ensure email is always stored in lowercase
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
});

// Create and export the User model, checking if it already exists
let User;
if (mongoose.modelNames().includes("users")) {
    User = mongoose.model("users");
} else {
    User = mongoose.model("users", userSchema);
}

export default User;

and 

analys frontend code 

'use client';
import React, { useState, useEffect } from 'react';

const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loginOut, setLoginOut] = useState('Sign In');

  // Toggle between Sign In and Sign Out
  const toggleLoginState = () => {
    setLoginOut(prevState => (prevState === 'Sign In' ? 'Sign Out' : 'Sign In'));
  };

  useEffect(() => {
    // Update the date and time every 100ms
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 100);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Extract individual date and time values
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // months are zero-indexed
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const milliseconds = currentDate.getMilliseconds();

  // Function to format time (adds leading zero if single digit)
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  // Format milliseconds to always show 3 digits
  const formatMilliseconds = (ms) => ms.toString().padStart(3, '0');

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Current Date and Time</h1>
      
      {/* Display Current Year, Month, Day */}
      <div className="mb-2">
        <p><strong>Year:</strong> {year}</p>
        <p><strong>Month:</strong> {month}</p>
        <p><strong>Day:</strong> {day}</p>
      </div>

      {/* Display Current Time: Hours, Minutes, Seconds, and Milliseconds */}
      <div className="mb-4">
        <p>
          <strong>Time:</strong> 
          {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}.{formatMilliseconds(milliseconds)}
        </p>
      </div>

      {/* Display Average Working Hours */}
      <div className="mb-4">
        <h2>Average working hours is: 8:00</h2>
      </div>

      {/* Sign In/Sign Out Button */}
      <div>
        {/* <button
          onClick={toggleLoginState}
          className={`bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ${loginOut}=='Sign In'?(active:green)||${loginOut}=='Sign Out'?(active:red)`}
        > */}
        <button
  onClick={toggleLoginState}
  className={`text-white px-4 py-2 rounded-lg 
    ${loginOut === 'Sign In' ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'}`}
>

          {loginOut}
        </button>
      </div>
    </div>
  );
};

export default Attendance;

and login .ts is 



import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {

    // await connect(tenantId);
    try {
        const reqBody = await request.json();
        const { email, password} = reqBody;
        

     
        await connect();
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        const tokendata = {
            id: user._id,
            email: user.email,
            username: user.username,
        };
        const token = jwt.sign(tokendata, process.env.TOKEN_SECRET!, { expiresIn: "1h" });

        const response = NextResponse.json({ message: "Login successful", token }, { status: 200 });
        response.cookies.set("token", token, { httpOnly: true });

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

and logout.ts is 



// logout.ts
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json({
            message: "Logout successful",
            success: true,
        });
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "An error occurred during logout." }, { status: 500 });
    }
}

me.ts is 

import { NextRequest, NextResponse } from "next/server";
// import { getDataFromToken } from "@/helpers/getDataFromToken";

import User from "@/models/userModel";
import { getDataFromToken } from "../getDataFromToken/route";
// import User from "@/models/UserModel";

// import { Connect } from "@/dbConfig/dbConfig";

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User found", data: user });
    } catch (error) {
        console.error("Fetch user error:", error);
        return NextResponse.json({ error: "An error occurred." }, { status: 400 });
    }
}

and signup.ts is 

import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        // Establish the connection to the database
        await connect();

        // Parse the JSON request body
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        // Basic validation for the required fields
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "Username, email, and password are required." },
                { status: 400 }
            );
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists." },
                { status: 400 }
            );
        }

        // Hash the password using bcrypt
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new user document
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();

        // Return a success response
        return NextResponse.json(
            { message: "User created successfully." },
            { status: 201 }
        );
    } catch (error: any) {
        // Log the error for debugging and send the error message as a response
        console.error("Error during user registration:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
rewrite and add user cart user onClick the sigin and signout history are stored in his cart page