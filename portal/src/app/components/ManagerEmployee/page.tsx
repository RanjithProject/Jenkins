'use client'

import { useAppContext } from "@/app/Context";
import axios from "axios";
import { useState } from "react";

const ManagerEmployee = () => {
  const { employeeId, userEmail } = useAppContext();

  console.log(employeeId);
  console.log(userEmail);

  const [employeeIdnum, setEmployeeIdnum] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');

  // Async submit handler
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!employeeIdnum || !employeeEmail) {
      alert("Please provide both Employee Id and Email");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:4000/manager/update-employee",
        {
          managerId: employeeId,  // Assuming 'employeeId' is the manager's ID
          managerEmail: userEmail, // Assuming 'userEmail' is the manager's email
          employeeId: employeeIdnum,
          employeeEmail: employeeEmail
        }
      );

      console.log(response.data);
      
      if (response.data.success) {
        alert("Updated successfully");
        setEmployeeIdnum('');
        setEmployeeEmail('');

      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.log(error, "Server error");
      alert("An error occurred while updating");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Manager and Employee Linking Page</h1>
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Employee Id:</label>
            <input 
              value={employeeIdnum}
              onChange={(e) => setEmployeeIdnum(e.target.value)}
              type="text" 
              id="employeeId"
              placeholder="Enter employee Id" 
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="employeeEmail" className="block text-sm font-medium text-gray-700">Employee Email:</label>
            <input 
              value={employeeEmail}
              onChange={(e) => setEmployeeEmail(e.target.value)}
              type="email"  // Changed type to 'email' for better semantic validation
              id="employeeEmail"
              placeholder="Enter employee Email" 
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerEmployee;

