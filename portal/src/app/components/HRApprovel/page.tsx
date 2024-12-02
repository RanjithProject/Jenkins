'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '@/app/Context';

const TodayLeaveApplications = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const {userRole}=useAppContext();
  // Fetch today's leave applications on component mount
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/todayLeaveApplications');
        
        if (response.data.success) {
          setLeaveData(response.data.data);  
        } else {
          setLeaveData([]);  
        }
      } catch (err) {
        setError('Error fetching leave applications');
      } finally {
        setLoading(false);  
      }
    };

    fetchLeaveData();
  }, []);

  // Handle leave status change
  const handleLeaveStatusChange = async (employeeId, leaveId, newStatus) => {
    try {
      const response = await axios.patch(`http://localhost:4000/api/updateLeaveStatus/${employeeId}/${leaveId}`, { leaveStatus: newStatus,approvedByRole:userRole });
      
      if (response.data.success) {
        // Update the local leaveData state with the updated status
        setLeaveData(prevData => 
          prevData.map(employee => 
            employee.employeeId === employeeId 
            ? {
                ...employee,
                todaysLeaves: employee.todaysLeaves.map(leave => 
                  leave._id === leaveId ? { ...leave, leaveStatus: newStatus } : leave
                )
              }
            : employee
          )
        );
      }
    } catch (err) {
      setError('Error updating leave status');
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Today's Leave Applications</h1>
      {leaveData.length === 0 ? (
        <p className="text-center text-gray-500">No leave applications for today.</p>
      ) : (
        leaveData.map((employee) => (
          <div key={employee.employeeId} className="leave-card bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-2xl font-semibold mb-2">{employee.username} (ID: {employee.employeeId})</h2>
            <p className="text-gray-700 mb-4">Email: {employee.email}</p>
            <h3 className="text-xl font-semibold mb-2">Leave Applications:</h3>
            <ul className="space-y-4">
              {employee.todaysLeaves.map((leave) => (
                <li key={leave._id} className="p-4 rounded-lg">
                  <div>
                    <strong className="font-semibold">Leave Type:</strong> {leave.leaveType}
                  </div>
                  <div>
                    <strong className="font-semibold">From:</strong> {new Date(leave.fromDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong className="font-semibold">To:</strong> {new Date(leave.toDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong className="font-semibold">Reason:</strong> {leave.reason}
                  </div>
                  <div className={`mt-2 p-2 rounded-md text-white ${leave.leaveStatus === 'pending' ? 'bg-yellow-500' : leave.leaveStatus === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}>
                    <strong>Status:</strong> {leave.leaveStatus}
                  </div>

                  {/* Leave Status Selection */}
                  <div className="mt-4">
                    <label className="font-semibold text-lg">Change Status:</label>
                    <select
                      value={leave.leaveStatus}
                      onChange={(e) => handleLeaveStatusChange(employee.employeeId, leave._id, e.target.value)}
                      className="ml-2 p-2 border rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default TodayLeaveApplications;

