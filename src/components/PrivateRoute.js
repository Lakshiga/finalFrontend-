import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    // If user is not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  const userRole = getUserRole();
  if (!allowedRoles.includes(userRole)) {
    // If user doesn't have the right role, redirect to home page
    return <Navigate to="/" />;
  }

  return children; // Render the protected component if authorized
};

// This is a mock authentication function.
// Replace it with your real authentication logic.
const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists, false otherwise
  };
  
  const getUserRole = () => {
    return localStorage.getItem('role'); // Fetch role from localStorage
  };
  


export default PrivateRoute;
