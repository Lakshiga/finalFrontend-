import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the backend
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      if (res.data.token || res.data.isVerified === false) {
        const { token, role, isVerified, msg } = res.data;


      if (msg) {
        alert(msg); // Use the msg variable to display the message
      }
      
        if (token) {
          // Store the token and user details in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify({ role, isVerified }));

          // Check login logic based on role
          if (role === 'Organizer') {
            alert('Login successful as organizer.');
            navigate('/organizer-dashboard');
          } else if (role === 'admin') {
            alert('Login successful as admin.');
            navigate('/admin-dashboard');
          } else {
            // For normal users (players, umpires)
            alert('Login successful.');
            navigate('/'); // Redirect to home or relevant dashboard for players, umpires
          }
        } else if (!isVerified && role === 'Organizer') {
          // Handle the unverified organizer
          alert('Login successful as organizer, but waiting for admin verification.');
          navigate('/organizer-dashboard'); // Navigate to the organizer dashboard but show waiting message
        }
      } else {
        setError('Login failed. Invalid credentials.');
      }
    } catch (err) {
      setError('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
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
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
};

export default Login;
