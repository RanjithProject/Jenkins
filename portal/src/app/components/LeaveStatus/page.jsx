'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "@/app/Context";

const LeaveStatusPage = () => {
  const { employeeId } = useAppContext(); // Get employeeId from context
  const [leaveStatus, setLeaveStatus] = useState(null); // State to store leave status data
  const [error, setError] = useState(null); // State to store error message
  const [loading, setLoading] = useState(false); // State to handle loading
  console.log("the Employee Id is : ",employeeId);
  // Fetch leave status whenever employeeId changes
  useEffect(() => {
    if (!employeeId) {
      setError("Employee ID is required");
      return;
    }

    // Fetch leave status from the backend API
    const fetchLeaveStatus = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors

      try {
        // Send request to the API to get leave status
        const response = await axios.get(`http://localhost:4000/api/employee/leavestatus?employeeId=${employeeId}`);

        setLeaveStatus(response.data.data);
      } catch (error) {
        console.error("Error fetching leave status:", error);
        setError("Failed to fetch leave status. Please try again.");
      } finally {
        setLoading(false); 
      }
    };

    fetchLeaveStatus(); 

  }, [employeeId]); // Dependency array ensures it runs whenever employeeId changes


  console.log(leaveStatus);
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Employee Leave Status</h1>

      {/* Error Message */}
      {error && <div className="text-red-600 mt-4">{error}</div>}

      {/* Loading Indicator */}
      {loading && <div>Loading...</div>}

      {/* Display Leave Status */}
      {leaveStatus && leaveStatus.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Leave Details</h2>
          <ul>
            {leaveStatus.map((leave) => (
              <li key={leave._id} className="mb-4 border p-4 rounded-lg">
                <div><strong>Leave Type:</strong> {leave.leaveType}</div>
                <div><strong>From:</strong> {new Date(leave.fromDate).toLocaleDateString()}</div>
                <div><strong>To:</strong> {new Date(leave.toDate).toLocaleDateString()}</div>
                <div><strong>Reason:</strong> {leave.reason}</div>
                <div className="p-1"><strong>ApprovedBy:</strong> <span className="bg-black p-2 rounded-e-lg text-white">{leave.approvedBy}</span></div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span className={`px-2 py-1 rounded-full ${leave.leaveStatus === "approved" ? "bg-green-500" : leave.leaveStatus === "rejected" ? "bg-red-500" : "bg-yellow-500"}`}>
                    {leave.leaveStatus}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !loading && <div>No leave data available</div>
      )}
    </div>
  );
};

export default LeaveStatusPage;
