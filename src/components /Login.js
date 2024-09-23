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

      console.log(res.data); // Debugging: Log the response data

      if (res.data.token) {
        const { token, role, isVerified } = res.data;

        // Store the token and user details in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ role, isVerified }));

        // Check if the user is an organizer and verified
        if (role === 'organizer' && isVerified) {
          alert('Login successful as verified organizer.');
          console.log('Navigating to organizer dashboard'); // Debugging
          navigate('/organizer-dashboard');
        } else if (role === 'organizer' && !isVerified) {
          setError('Your account is not verified yet. Please wait for admin approval.');
        } else if (role === 'admin') {
          alert('Login successful as admin.');
          console.log('Navigating to admin dashboard'); // Debugging
          navigate('/admin-dashboard');
        } else {
          console.log('Navigating to home page'); // Debugging
          navigate('/'); // Default redirect for other roles
        }
      } else {
        setError('Login failed. Invalid credentials.');
      }
    } catch (err) {
      console.error(err); // Log the error for debugging
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
