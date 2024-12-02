
'use client';
import { useAppContext } from '@/app/Context';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function LeaveCalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [leaveStatus, setLeaveStatus] = useState(null);

  const { employeeId } = useAppContext(); 
  const daysInMonth = () => {
    const daysArray = [];
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
// console.log(firstDay);
// console.log(lastDay);


// console.log(employeeId);

    useEffect(()=>{
           // Fetch leave status from the backend API
    const fetchLeaveStatus = async () => {
        if (!employeeId) {
            console.log("Employee ID is required");
            return;
          }
  
        try {
          // Send request to the API to get leave status
          const response = await axios.get(`http://localhost:4000/api/employee/leavestatus?employeeId=${employeeId}`);
  console.log(response.data);
  
          setLeaveStatus(response.data.data);
        } catch (error) {
          console.error("Error fetching leave status:", error);

        } 
      };
  
      fetchLeaveStatus(); 
    },[employeeId]);




    // Fill in empty slots before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      daysArray.push(null);
    }

    // Fill in the days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));
    }

    return daysArray;
  };

  // Change the month
  const changeMonth = (increment) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + increment);
    setSelectedDate(newDate);
  };

console.log("leaveStatus is : ",leaveStatus);


  return (
    <div className="calendar p-4 bg-white shadow-lg rounded-lg">
      {/* Header: Month and Year Selector */}
      <div className="header flex justify-between items-center mb-4">
        <button
          className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-black"
          onClick={() => changeMonth(-1)}
        >
          &lt; Prev
        </button>

        {/* Month Selector */}
        <select
          className="border rounded px-4 py-2 text-black"
          value={selectedDate.getMonth()}
          onChange={(e) => setSelectedDate(new Date(selectedDate.getFullYear(), e.target.value, 1))}
        >
          {months.map((month, i) => (
            <option value={i} key={i}>{month}</option>
          ))}
        </select>

        {/* Year Selector */}
        <select
          className="border rounded px-4 py-2 text-black"
          value={selectedDate.getFullYear()}
          onChange={(e) => setSelectedDate(new Date(e.target.value, selectedDate.getMonth(), 1))}
        >
          {Array.from({ length: 10 }, (_, i) => selectedDate.getFullYear() - 5 + i).map((year) => (
            <option value={year} key={year}>{year}</option>
          ))}
        </select>

        <button
          className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-black"
          onClick={() => changeMonth(1)}
        >
         Next &gt;
        </button>
      </div>

      {/* Days of the Week Header */}
      <div className="days-of-week grid grid-cols-7 gap-1 mb-4 text-center text-sm font-semibold">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-gray-600">{day}</div>
        ))}
      </div>

      {/* Days of the Month */}
      <div className="days grid grid-cols-7 gap-1">
        {daysInMonth().map((day, index) => (
          <div key={index} className={`p-2 text-center ${day ? 'border border-gray-300 hover:bg-blue-100 cursor-pointer' : ''}`}>
            {day ? day.getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  );
}
