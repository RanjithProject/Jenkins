
'use client';
import { useAppContext } from '@/app/Context';
import axios from 'axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Attendance = () => {
  const { userName } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loginOut, setLoginOut] = useState('Sign Out');
  const [breakStatus, setBreakStatus] = useState('Break Out'); // Default set to 'Break Out'
  const [loginHistory, setLoginHistory] = useState([]);
  const [breakHistory, setBreakHistory] = useState([]);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [totalWorkingTime, setTotalWorkingTime] = useState(0);
  const [shiftStartTime, setShiftStartTime] = useState(null); 

  // Fetch login and break history from the backend
  const fetchLoginHistory = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/login-history', {
        params: { username: userName },
      });
      const data = response.data;

      // Extract the last action (login or logout) and break status
      const lastAction = data.history[data.history.length - 1].action;

      // Find the last "Sign In" action in the history array
      let lastSignInAction = null;
      for (let i = data.history.length - 1; i >= 0; i--) {
        if (data.history[i].action === 'Sign In') {
          lastSignInAction = data.history[i];
          break;
        }
      }

      // Extract the last break timestamp status from the last "Sign In" action
      const lastBreakTimestamp = lastSignInAction?.breaktimestamp?.length > 0
        ? lastSignInAction.breaktimestamp[lastSignInAction.breaktimestamp.length - 1].status
        : 'Break Out'; // Default to 'Break Out'

      // Set the state values for loginOut and breakStatus
      setLoginOut(lastAction);
      setBreakStatus(lastBreakTimestamp);

      const history = response.data.history.flatMap(entry => {
        const historyItem = [{ action: entry.action, timestamp: entry.timestamp }];

        if (entry.breaktimestamp && entry.breaktimestamp.length > 0) {
          entry.breaktimestamp.forEach(breakEntry => {
            historyItem.push({
              action: breakEntry.status,
              timestamp: breakEntry.timestamp,
              type: 'break'
            });
          });
        }

        return historyItem;
      });

      setLoginHistory(history.filter(entry => entry.type !== 'break'));
      setBreakHistory(history.filter(entry => entry.type === 'break'));

      calculateTotalBreakTime(response.data.history);
      calculateTotalWorkingTime(response.data.history);
    } catch (error) {
      console.error('Error fetching login history:', error.response?.data || error.message);
    }
  };

  // Fetch shift start time from the backend (if available)
  const fetchShiftDetails = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/shift-details', {
        params: { username: userName },
      });
      setShiftStartTime(response.data.shiftStartTime); // Store the shift start time
    } catch (error) {
      console.error('Error fetching shift details:', error.response?.data || error.message);
    }
  };

  // Calculate total break time in milliseconds
  const calculateTotalBreakTime = (history) => {
    let breakTime = 0;
    history.forEach(entry => {
      if (entry.breaktimestamp) {
        entry.breaktimestamp.forEach((breakEntry, index) => {
          const breakIn = new Date(breakEntry.timestamp);
          const breakOut = entry.breaktimestamp[index + 1] && entry.breaktimestamp[index + 1].status === 'Break Out'
            ? new Date(entry.breaktimestamp[index + 1].timestamp)
            : null;

          if (breakOut) {
            breakTime += breakOut - breakIn;
          }
        });
      }
    });

    setTotalBreakTime(breakTime);
  };

  // Calculate total working time by subtracting break time from login/logout duration
  const calculateTotalWorkingTime = (history) => {
    let workingTime = 0;
    let lastSignIn = null;

    history.forEach(entry => {
      if (entry.action === 'Sign In') {
        lastSignIn = new Date(entry.timestamp);
      }

      if (entry.action === 'Sign Out' && lastSignIn) {
        const signOut = new Date(entry.timestamp);
        workingTime += signOut - lastSignIn;
        lastSignIn = null;
      }
    });

    // Subtract the total break time from working time
    workingTime -= totalBreakTime;
    setTotalWorkingTime(workingTime);
  };

  // Function to handle Sign In / Sign Out
  const handleSignInOut = async () => {
    const newState = loginOut === 'Sign Out' ? 'Sign In' : 'Sign Out';

    // If signing in, check if the current time is before shift start time
    if (newState === 'Sign In' && shiftStartTime) {
      const currentTime = new Date();
      const shiftStart = new Date(shiftStartTime);

      if (currentTime < shiftStart) {
        alert(`You cannot sign in before your shift starts at ${shiftStart.toLocaleTimeString()}`);
        return; // Prevent sign in if before shift start time
      }
    }

    try {
      await axios.patch('http://localhost:4000/api/login', {
        action: newState,
        username: userName,
        timestamp: new Date().toISOString(),
      });

      fetchLoginHistory(); // Refresh login and break history after the action
    } catch (error) {
      console.error('Error logging action:', error.response?.data || error.message);
    }
  };

  // Function to handle Break In / Break Out
  const handleBreakInOut = async () => {
    if (loginOut !== 'Sign In') {
      console.error('Cannot take a break unless signed in');
      return;
    }

    const newStatus = breakStatus === 'Break Out' ? 'Break In' : 'Break Out'; // Toggle between 'Break In' and 'Break Out'

    try {
      await axios.patch('http://localhost:4000/api/break', {
        username: userName,
        status: newStatus,
        timestamp: new Date().toISOString(),
      });

      fetchLoginHistory(); // Refresh login and break history after the action
    } catch (error) {
      console.error('Error logging break action:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    fetchLoginHistory();
    fetchShiftDetails(); // Fetch the shift details once on mount

    return () => clearInterval(intervalId);
  }, [userName]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Attendance and Break History</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="space-y-4">
          <h2 className="text-xl">Login State: <span className="font-semibold">{loginOut}</span></h2>
          <button
            onClick={handleSignInOut}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            {loginOut === 'Sign Out' ? 'Sign In' : 'Sign Out'}
          </button>
        </div>

        <div>
          <Link href={'/components/LeaveApplyPage'} className="text-white px-4 py-2 rounded-lg bg-black">Leave Apply</Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl">Break Status: <span className="font-semibold">{breakStatus}</span></h2>
          <button
            onClick={handleBreakInOut}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
          >
            {breakStatus === 'Break Out' ? 'Break In' : 'Break Out'}
          </button>
        </div>
      </div>

      {/* Login History Table */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Login History</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Timestamp</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loginHistory.map((entry, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{new Date(entry.timestamp).toLocaleString()}</td>
                <td className="py-2 px-4">{entry.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Break History Table */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Break History</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Timestamp</th>
              <th className="py-2 px-4 text-left">Break Status</th>
            </tr>
          </thead>
          <tbody>
            {breakHistory.map((entry, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{new Date(entry.timestamp).toLocaleString()}</td>
                <td className="py-2 px-4">{entry.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-2">
        <h3 className="text-xl font-semibold">Total Working Time: {totalWorkingTime / 1000} seconds</h3>
        <h3 className="text-xl font-semibold">Total Break Time: {totalBreakTime / 1000} seconds</h3>
      </div>
    </div>
  );
};

export default Attendance;
