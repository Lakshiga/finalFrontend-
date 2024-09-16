import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Corrected: Added useNavigate import
import '../css/Login.css'; // Import the CSS file for styling

const Login = () => {
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [error, setError] = useState(''); // State for handling error messages
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    try {
      // Send a POST request to the backend login endpoint
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      // If login is successful and a token is received
      if (res.data.token) {
        // Store the token and role in localStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role); // Store role (admin, organizer, etc.)

        alert('Login successful');

        // Redirect based on the role stored in localStorage
        if (res.data.role === 'admin') {
          navigate('/admin-dashboard'); // Redirect to Admin Dashboard
        } else if (res.data.role === 'organizer') {
          navigate('/organizer-dashboard'); // Redirect to Organizer Dashboard
        } else {
          navigate('/'); // Default redirect for other roles
        }
      } else {
        // If the response does not have a token, show login failed message
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      // If the request fails (wrong credentials or other errors), show an error message
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p> Don't have an account? 
      <a href="/register">Register here</a></p> {/* Link to registration */}
    </div>
  );
};

export default Login;
