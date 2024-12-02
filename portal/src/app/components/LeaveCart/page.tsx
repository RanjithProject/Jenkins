'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Component to handle and display each employee's leave request with dropdown for approval/rejection
const LeaveRequestCard = ({ leave, employeeId, onStatusChange }) => {
  // Tailwind classes based on the leave status
  const statusClass = {
    pending: 'bg-yellow-200 text-yellow-800',
    approved: 'bg-green-200 text-green-800',
    rejected: 'bg-red-200 text-red-800',
  };

  return (
    <div key={leave._id} className={`leave-card p-4 my-2 rounded-lg ${statusClass[leave.leaveStatus]}`}>
      <p className="font-semibold">Leave Type: {leave.leaveType}</p>
      <p>From: {new Date(leave.fromDate).toLocaleString()}</p>
      <p>To: {new Date(leave.toDate).toLocaleString()}</p>
      <p>Reason: {leave.reason}</p>
      <p>Status: {leave.leaveStatus}</p>

      {/* Dropdown for admin/manager to change the leave status */}
      {leave.leaveStatus === 'pending' && (
        <div>
          <select
            className="mt-2 p-2 border border-gray-300 rounded-md"
            onChange={(e) => onStatusChange(leave._id, e.target.value, employeeId)}
            value={leave.leaveStatus}
          >
            <option value="pending" disabled>
              Select Status
            </option>
            <option value="approved">Approve</option>
            <option value="rejected">Reject</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default function LeaveRequestsPage() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the leave requests for today
  const fetchLeaveRequests = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/todayLeaveApplications');
      if (response.data.success) {
        setLeaveRequests(response.data.data); // Set the data directly from the API response
      } else {
        setError('No leave requests found for today');
      }
    } catch (err) {
      setError('Error fetching leave requests');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle status change for leave request
  const handleStatusChange = useCallback(async (leaveRequestId, status, employeeId) => {
    try {
      const response = await axios.put(`http://localhost:4000/leave/approve/${leaveRequestId}`, {
        status,
        adminComments: `${status.charAt(0).toUpperCase() + status.slice(1)} by admin`, // Optional comments
        approvedBy: 'admin123', // Replace with actual admin ID
      });

      if (response.data.success) {
        // Update the local state to reflect the new leave status
        setLeaveRequests((prevRequests) =>
          prevRequests.map((employee) =>
            employee.employeeId === employeeId
              ? {
                  ...employee,
                  todaysLeaves: employee.todaysLeaves.map((leave) =>
                    leave._id === leaveRequestId ? { ...leave, leaveStatus: status } : leave
                  ),
                }
              : employee
          )
        );
      }
    } catch (err) {
      setError('Error processing the leave request');
    }
  }, []);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  if (loading) {
    return <div>Loading leave requests...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Today's Leave Requests</h1>
      <div>
        {leaveRequests.length === 0 ? (
          <p>No leave applications for today.</p>
        ) : (
          leaveRequests.map((employee) => (
            <div key={employee.employeeId} className="leave-request-card mb-6">
              <h3 className="font-semibold text-lg">{employee.username} ({employee.email})</h3>
              {employee.todaysLeaves.map((leave) => (
                <LeaveRequestCard
                  key={leave._id}
                  leave={leave}
                  employeeId={employee.employeeId}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
