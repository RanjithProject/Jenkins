
'use client';
import { useEffect, useState } from "react";
import axios from "axios";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState({});
  const [error, setError] = useState("");

  // Fetch employees data on page load using Axios
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await axios.get("http://localhost:4000/api/getAllEmployees");
        if (response.data.success) {
          // Filter employees with 'userrole' as 'employee'
          const filteredEmployees = response.data.data.filter(
            (employee) => employee.userrole === "employee"
          );
          setEmployees(filteredEmployees);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  // Handle shift change using Axios
  const handleShiftChange = async (employeeId, shiftType) => {
    try {
      const response = await axios.put("http://localhost:4000/api/changeEmployeeShift", {
        employeeId,
        shiftType
      });

      if (response.data.success) {
        alert("Shift updated successfully");
        // Update the employee's shift in the local state
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.employeeId === employeeId
              ? { ...emp, shift: { ...emp.shift, shiftType } }
              : emp
          )
        );
      } else {
        alert("Error alert it");
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to update shift.");
    }
  };

  // Determine shift timings based on the selected shift
  const getShiftTiming = (shiftType) => {
    switch (shiftType) {
      case 'morning':
        return { start: "9:00 AM", end: "6:00 PM" };
      case 'midshift':
        return { start: "2:00 PM", end: "11:00 PM" };
      case 'nightshift':
        return { start: "6:00 PM", end: "3:00 AM" };
      default:
        return { start: "N/A", end: "N/A" };
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Employee Shifts</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((employee) => (
            <div key={employee._id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">{employee.username}</h2>
              <p className="text-sm text-gray-500">Employee ID: {employee.employeeId}</p>
              <p className="text-sm text-gray-500">Email: {employee.email}</p>
              <p className="text-sm text-gray-500">Role: {employee.userrole}</p>

              <div className="mt-4">
                <p className="font-medium">Current Shift: {employee.shift.shiftName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(employee.shift.startTime).toLocaleString()} -{" "}
                  {new Date(employee.shift.endTime).toLocaleString()}
                </p>

                <select
                  className="mt-2 p-2 border rounded-md"
                  value={selectedShift[employee.employeeId] || employee.shift.shiftType}
                  onChange={(e) => {
                    setSelectedShift({
                      ...selectedShift,
                      [employee.employeeId]: e.target.value,
                    });
                  }}
                >
                  <option value="morning">Morning Shift (9:00 AM - 6:00 PM)</option>
                  <option value="midshift">Mid Shift (2:00 PM - 11:00 PM)</option>
                  <option value="nightshift">Night Shift (6:00 PM - 3:00 AM)</option>
                </select>

                <button
                  className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={() =>
                    handleShiftChange(
                      employee.employeeId,
                      selectedShift[employee.employeeId] || employee.shift.shiftType
                    )
                  }
                >
                  Change Shift
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
