// 'use client';
// // components/Calendar.tsx
// import { useState } from "react";

// const Calendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());

//   console.log("currentDate : ",currentDate);
  
//   // Function to get the first day of the current month
//   const getFirstDayOfMonth = (date: Date) => {
//     return new Date(date.getFullYear(), date.getMonth(), 1);
//   };


//   // Function to get the last day of the current month
//   const getLastDayOfMonth = (date: Date) => {
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0);
//   };


//   // Function to generate the calendar days for the month
//   const generateCalendarDays = (date: Date) => {
//     const firstDay = getFirstDayOfMonth(date);
//     const lastDay = getLastDayOfMonth(date);

//     const days = [];
//     // Add empty slots for the days before the first day of the month
//     for (let i = 0; i < firstDay.getDay(); i++) {
//       days.push(null);
//     }

//     // Add days of the current month
//     for (let i = 1; i <= lastDay.getDate(); i++) {
//       days.push(i);
//     }

//     // Add empty slots for the days after the last day of the month
//     const remainingDays = 7 - (days.length % 7);
//     for (let i = 0; i < remainingDays && remainingDays !== 7; i++) {
//       days.push(null);
//     }

//     return days;
//   };

//   // Navigate to the previous month
//   const goToPreviousMonth = () => {
//     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
//   };

//   // Navigate to the next month
//   const goToNextMonth = () => {
//     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
//   };

//   // Get the current month's name
//   const getMonthName = (monthIndex: number) => {
//     const monthNames = [
//       "January", "February", "March", "April", "May", "June", 
//       "July", "August", "September", "October", "November", "December"
//     ];
//     return monthNames[monthIndex];
//   };

//   // Generate the list of calendar days
//   const days = generateCalendarDays(currentDate);

//   return (
//     <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
//       {/* Header with navigation */}
//       <div className="flex items-center justify-between mb-4">
//         <button
//           onClick={goToPreviousMonth}
//           className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
//         >
//           &lt;
//         </button>
//         <span className="text-xl font-semibold">
//           {`${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`}
//         </span>
//         <button
//           onClick={goToNextMonth}
//           className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
//         >
//           &gt;
//         </button>
//       </div>

//       {/* Weekday labels */}
//       <div className="grid grid-cols-7 text-center font-medium mb-2">
//         <div>Sun</div>
//         <div>Mon</div>
//         <div>Tue</div>
//         <div>Wed</div>
//         <div>Thu</div>
//         <div>Fri</div>
//         <div>Sat</div>
//       </div>

//       {/* Calendar Days */}
//       <div className="grid grid-cols-7 gap-1">
//         {days.map((day, index) => (
//           <div
//             key={index}
//             className={`h-10 flex items-center justify-center rounded-md cursor-pointer transition 
//               ${day ? "hover:bg-gray-200" : "bg-gray-100"} 
//               ${!day ? "text-transparent" : "text-black"}`}
//           >
//             {day}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Calendar;




// 'use client';
// import React, { useState } from 'react'
// import "../app/page.css"

// const daysOfWeek=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
// const months = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];

// export default function Calendar() {

//   const [selectedDate,setSelectedDate]=useState(new Date());

//   const daysInMonth=()=>{
//     const daysArray=[];
//     const firstDay=new Date(selectedDate.getFullYear(),selectedDate.getMonth(),1);
//     const lastDay=new Date(selectedDate.getFullYear(),selectedDate.getMonth()+1,0);

//     console.log(firstDay);
//     console.log(lastDay);
    
//     for(let i=0;i<=firstDay.getDay();i++){
//       daysArray.push(null);
//     }

//     for(let i=0;i<=lastDay.getDay();i++){
//       daysArray.push(new Date(selectedDate.getFullYear(),selectedDate.getMonth(),i));
//     }

//     return daysArray;
//   }

 

//   daysInMonth();

//   return (
//     <div className='calendar'>
//       <div className="header">
//         <button> &lt;</button>
//         <select value={selectedDate.getMonth()}>
//           {months.map((month,i)=>(
//             <option value={i} key={i}>{month}</option>
//           ))}
//         </select>

//         <select value={selectedDate.getFullYear()}>
//           {
//             Array.from({length:10},(_,i)=>selectedDate.getFullYear()-5+i)
//             .map((year)=>(
//               <option value={year} key={year}>{year}</option>
//             ))
//           }
//         </select>
//         <button> &gt;</button>
//         </div>

//         <div className="daysofweek">
// {
//   daysOfWeek.map((day)=>(
//     <div key={day} className="">{day}</div>
//   ))
// }
//         </div>
//      <div className="">
//       {daysInMonth().map((day,index)=>(
//         <div className="" key={index}>
//           {day?day.getDate():""}
//         </div>
//       ))}
//      </div>
//     </div>
//   )
// }



'use client';
import React, { useState } from 'react';

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = () => {
    const daysArray = [];
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

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

  return (
    <div className="calendar p-4 bg-white shadow-lg rounded-lg">
      {/* Header: Month and Year Selector */}
      <div className="header flex justify-between items-center mb-4">
        <button
          className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-black"
          onClick={() => changeMonth(-1)}
        >
          &lt;
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
          &gt;
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
