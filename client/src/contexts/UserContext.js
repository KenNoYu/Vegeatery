import React, { createContext, useState, useEffect } from 'react';
import http from '../http'; // Assuming you have an HTTP client

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http
        .get("/Auth/auth")
        .then((res) => {
          setUserId(res.data.user.id); 
        })
        .catch((err) => {
          console.error("Error fetching user data", err);
        });
    }
  }, []);

  return userId; // Return the userId as an object
};

export default UserContext;