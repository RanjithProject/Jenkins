'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create a Context for the app
const AppContext = createContext(null);

// Context Provider component
export function AppWrapper({ children }) {
  const [userName, setUserName] = useState(null);
  const [employeeId,setEmployeeId]=useState(null);
const [userEmail,setUserEmail]=useState(null);
const [userRole,setuserRole]=useState(null);
  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get('/api/users/me');
      setUserName(res.data.data.username); 
      setEmployeeId(res.data.data.employeeId);
      setUserEmail(res.data.data.email);
      setuserRole(res.data.data.userrole);
    } catch (error) {
      console.error(error.message);
      setUserName(null); 
    }
  };
// console.log(userName);
// console.log("userRole :",userRole);

// console.log(employeeId);
// console.log(userEmail);


  // Update the user details by calling the fetch function
  const updateUserDetails = () => {
    fetchUserDetails();
  };

  // Fetch user details when the component mounts
  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <AppContext.Provider value={{employeeId, userName, updateUserDetails ,userEmail,userRole}}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the app context
export function useAppContext() {
  return useContext(AppContext);
}
