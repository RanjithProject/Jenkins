'use client';
import { useAppContext } from '@/app/Context';
import axios from 'axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Attendance = () => {
  const { userName } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loginOut, setLoginOut] = useState('Sign Out');
  const [breakStatus, setBreakStatus] = useState('Break Out');
  const [loginHistory, setLoginHistory] = useState([]);
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

      console.log(data);

      // Extract the last action
      const lastAction = data.history[data.history.length - 1].action;

      // Find the last "Sign In" action in the history array
      let lastSignInAction = null;
      for (let i = data.history.length - 1; i >= 0; i--) {
        if (data.history[i].action === 'Sign In') {
          lastSignInAction = data.history[i];
          break;
        }
      }

      // Extract the last breaktimestamp status from the last "Sign In" action
      const lastBreakTimestamp = lastSignInAction?.breaktimestamp?.length > 0
        ? lastSignInAction.breaktimestamp[lastSignInAction.breaktimestamp.length - 1].status
        : 'Break Out'; //the default actions is "break Out"

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

      setLoginHistory(history);
      calculateTotalBreakTime(response.data.history);
      calculateTotalWorkingTime(response.data.history);
    } catch (error) {
      // console.error('Error fetching login history:', error.response?.data || error.message);
      console.log("server error : ",error);
      
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
      // console.error('Error fetching shift details:', error.response?.data || error.message);
      console.log("server error : ",error);
      
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
        alert(error.response.data.message);
        
        console.error('Error logging action:', error.response?.data || error.message);
      }
    };
  
  const handleBreakInOut = async () => {
    if (loginOut !== 'Sign In') {
      console.error('Cannot take a break unless signed in');
      alert('Cannot take a break unless signed in');
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
  
  
    // Calculate duration between Sign In and Sign Out (including milliseconds)
  const calculateSignInSignOutDuration = (signInTimestamp, signOutTimestamp) => {
    const signIn = new Date(signInTimestamp);
    const signOut = new Date(signOutTimestamp);
    const diffInMilliseconds = signOut - signIn;

    const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);
    const milliseconds = diffInMilliseconds % 1000;

    return { hours, minutes, seconds, milliseconds };
  };

  // Format time with leading zeros for display
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  // Format milliseconds to show leading zero
  const formatMilliseconds = (milliseconds) => (milliseconds < 100 ? `0${milliseconds}` : milliseconds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    fetchLoginHistory();

    return () => clearInterval(intervalId);
  }, [userName]);

 

  const renderBreakHistory = () => {
    const breakEntries = [];

    loginHistory.forEach((entry) => {
      if (entry.type === 'break' && (entry.action === 'Break In' || entry.action === 'Break Out')) {
        const timestamp = new Date(entry.timestamp).toLocaleString();

        // If it's a "Break In" action, create an entry for Break In
        if (entry.action === 'Break In') {
          breakEntries.push({ breakIn: timestamp, breakOut: null, duration: null });
        }

        // If it's a "Break Out" action, find the corresponding "Break In"
        if (entry.action === 'Break Out') {
          const lastBreakIn = breakEntries.find((e) => e.breakOut === null);
          if (lastBreakIn) {
            lastBreakIn.breakOut = timestamp;
            const breakDuration = calculateBreakDuration(lastBreakIn.breakIn, lastBreakIn.breakOut);
            lastBreakIn.duration = `${formatTime(breakDuration.hours)}:${formatTime(breakDuration.minutes)}:${formatTime(breakDuration.seconds)}:${formatMilliseconds(breakDuration.milliseconds)} ms`;
          }
        }
      }
    });

    return breakEntries;
  };

  // Format Login History for Sign In/Sign Out table
  const renderLoginHistory = () => {
    const loginEntries = [];

    loginHistory.forEach((entry, index) => {
      if (entry.action === 'Sign In' || entry.action === 'Sign Out') {
        const timestamp = new Date(entry.timestamp).toLocaleString();

        if (entry.action === 'Sign In') {
          loginEntries.push({ signIn: timestamp, signOut: null, duration: null });
        } else if (entry.action === 'Sign Out') {
          const lastSignIn = loginEntries.find(e => e.signOut === null);
          if (lastSignIn) {
            lastSignIn.signOut = timestamp;
            const duration = calculateSignInSignOutDuration(lastSignIn.signIn, lastSignIn.signOut);
            lastSignIn.duration = `${formatTime(duration.hours)}:${formatTime(duration.minutes)}:${formatTime(duration.seconds)}.${formatMilliseconds(duration.milliseconds)}`;
          }
        }
      }
    });

    return loginEntries;
  };


    // Helper function to calculate break duration
    const calculateBreakDuration = (breakIn, breakOut) => {
      const breakInTime = new Date(breakIn);
      const breakOutTime = new Date(breakOut);
      const durationInMs = breakOutTime - breakInTime;
  
      return {
        hours: Math.floor(durationInMs / (1000 * 60 * 60)),
        minutes: Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((durationInMs % (1000 * 60)) / 1000),
        milliseconds: durationInMs % 1000,
      };
    };

      // Convert milliseconds to a time format (hours:minutes:seconds.milliseconds)
  const formatMillisecondsTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    const ms = milliseconds % 1000;
    
    return `${hours}:${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(ms)}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Attendance and Break History</h1>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl">Login State: <span className="font-semibold">{loginOut}</span></h2>
          <button
            onClick={handleSignInOut}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            {loginOut === 'Sign Out' ? 'Sign In' : 'Sign Out'}
          </button>
        </div>
       
        <div>
          <Link href={'/components/LeaveApplyPage'} className='text-white px-4 py-2 rounded-lg bg-black'>Leave Apply</Link>
        
        </div>
       
        <div>
          <h2 className="text-xl">Break Status: <span className="font-semibold">{breakStatus}</span></h2>
          <button
            onClick={handleBreakInOut}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
          >
            {breakStatus === 'Break Out' ? 'Break In' : 'Break Out'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Login History</h3>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Sign In</th>
              <th className="px-4 py-2 border">Sign Out</th>
              <th className="px-4 py-2 border">Duration</th>
            </tr>
          </thead>
          <tbody>
            {renderLoginHistory().map((entry, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{entry.signIn||"-"}</td>
                <td className="px-4 py-2 border">{entry.signOut||"-"}</td>
                <td className="px-4 py-2 border">{entry.duration||"-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Break History</h3>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Break In</th>
              <th className="px-4 py-2 border">Break Out</th>
              <th className="px-4 py-2 border">Duration</th>
            </tr>
          </thead>
          <tbody>
            {renderBreakHistory().map((entry, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{entry.breakIn||"-"}</td>
                <td className="py-2 px-4">{entry.breakOut||"-"}</td>
                <td className="py-2 px-4">{entry.duration||"-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Total Break Time</h3>
        <p className="text-lg">{formatMillisecondsTime(totalBreakTime)}</p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Total Working Time</h3>
        <p className="text-lg font-medium text-gray-700"><strong>Total Working Time:</strong> {formatMillisecondsTime(totalWorkingTime)}</p>
      </div>
    </div>
  );
};

export default Attendance;





