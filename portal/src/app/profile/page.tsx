"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Calendar from "../page";

export default function ProfilePage() {
  const router = useRouter();

  // State to store user data
  const [user, setUser] = useState(null);

  // Logout function
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout Successful");
      router.push("/login");
    } catch (error) {
      console.error(error.message);
      toast.error("Error logging out");
    }
  };

  // Fetch user details (username and id)
  const getUserDetails = async () => {
    try {
      const response = await axios.get("/api/users/me");
      setUser(response.data.data); // Set the user data
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to fetch user details");
    }
  };

  // Fetch user details on component mount
  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-lg font-semibold">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
          </div>
          <div className="flex space-x-6">
            <Link href="/profile" className="hover:text-gray-300">
              Profile
            </Link>
            <span>
              {user ? (
                <span>{user.username}</span> // Display the user's name
              ) : (
                "Loading..." // Show loading text if no user data
              )}
            </span>
            <button
              onClick={logout}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Calendar */}
      <Calendar />
    </div>
  );
}
