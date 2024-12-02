
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { useAppContext } from "../Context";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";


export default function LoginPage() {
    const router = useRouter();
    const { updateUserDetails } = useAppContext();

    const [user, setUser] = useState({
        email: "",
        password: "",
        employeeId: ""
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState("");  // State to hold the role

    const onLogin = async () => {
        if (!user.email || !user.password || !user.employeeId) {
            return alert("Please fill in all fields.");
        }

        try {
            console.log(user);

            setLoading(true);
            const response = await axios.post('/api/users/login', user);
            console.log("Login Response", response.data);

            // Get the token from response and store it
            const { token } = response.data;
            setToken(token);

            // Decode the token to extract user role
            const decodedToken = jwtDecode(token);
            console.log("Decoded Token:", decodedToken);

            // Extract the role from the decoded token
            setRole(decodedToken.userrole);  // Assuming the role is stored as 'userrole' in the token

            // Update user details in context
            updateUserDetails(response.data.user);

            // Redirect based on the user role
            const redirectPath = '/components/Attentance'; // You can customize the redirection path based on the role
            router.push(redirectPath);
        } catch (error) {
            console.log("Login failed", error);
            alert("Login failed: " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setButtonDisabled(!(user.email && user.password));
    }, [user]);

    console.log("Token:", token);
    console.log("Role:", role);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2">
            <h1 className="text-2xl font-bold mb-4">{loading ? "Processing" : "Login"}</h1>
            <hr className="w-full mb-4" />

            <label htmlFor="number" className="mb-1">Employee Id : </label>
            <input
                className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black mb-4 w-80"
                id="Employee Id"
                type="number"
                value={user.employeeId}
                onChange={(e) => setUser({ ...user, employeeId: e.target.value })}
                placeholder="Enter Employee ID : "
            />

            <label htmlFor="email" className="mb-1">Email</label>
            <input
                className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black mb-4 w-80"
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email"
            />

            <label htmlFor="password" className="mb-1">Password</label>
            <div className="relative mb-4 w-80">
                <input
                    className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black w-full"
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Password"
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                >
                    {passwordVisible ? <FaEyeSlash className="text-gray-600" /> : <FaRegEye className="text-gray-600" />}
                </button>
            </div>
            <button
                onClick={onLogin}
                className="p-2 border border-gray-300 mb-4 bg-blue-500 text-white rounded-lg w-80 hover:bg-blue-600 transition duration-200"
                disabled={buttonDisabled || loading}
            >
                {loading ? "Logging in..." : "Login"}
            </button>

            <div className="flex flex-col items-center">
                <Link href="/signup" className="text-blue-500 mb-2">Visit Sign Up</Link>
                <Link href="/forgotpassword" className="text-blue-500">Forgot Password?</Link>
            </div>
        </div>
    );
}
