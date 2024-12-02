"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppContext } from "@/app/Context";

export default function ProfilePage() {
  const router = useRouter();

  // State to store user data
  const [user, setUser] = useState(null);
  const { updateUserDetails, userName } = useAppContext();
  console.log(userName);

  // Logout function
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout Successful");
      setUser(null);  
      updateUserDetails();
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
      if (response.data?.data) {
        setUser(response.data.data); // Set the user data dynamically
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to fetch user details");
    }
  };

  // Fetch user details on component mount
  useEffect(() => {
    getUserDetails();
  }, []);

  // This will automatically update the UI when the user role or data changes.
  console.log("the user role is : ", user?.userrole);

  return (
    <div className="flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-lg font-semibold">
            <Link href="/" className="hover:text-gray-300">
              Home jenkins 
            </Link>
          </div>
          <div className="flex space-x-6">
            <Link href="/components/Attentance" className="hover:text-gray-300">
              Attentance
            </Link>

            <Link href="/components/LeaveApplyPage" className="hover:text-gray-300">
              LeaveApply
            </Link>
            <Link href="/components/LeaveStatus" className="hover:text-gray-300">
              LeaveStatus
            </Link>

            {/* Conditionally render pages based on user role */}
            {user?.userrole === "hr" && (
              <Link href="/components/HREmployeeConnection" className="hover:text-gray-300">
                HREmployeeConnection
              </Link>
            )}
            {user?.userrole === "manager" && (
              <Link href="/components/managerEmployee" className="hover:text-gray-300">
                ManagerEmployee
              </Link>
            )}

{
              user?.userrole==="employee"?(
                <div className=""></div>
              ):
              (
                <div className="">
                    <Link href="/components/HRApprovel" className="hover:text-gray-300">
                HRApprovel
              </Link>
                </div>
              )
            }

            {/* Conditionally render the username or login button */}
            <div className="flex items-center space-x-4">
              {userName ? (
                <>
                  <span className="text-white">{userName}</span> {/* Display user name */}
                  <button
                    onClick={logout}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
