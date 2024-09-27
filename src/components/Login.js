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

      // Check if response contains token and role information
      if (res.data.token) {
        const { token, role } = res.data;

        // Save the token and user role in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('role', role); // Save the role separately for easy access

        // Check login logic based on the role
        if (role && role.toLowerCase() === 'admin') {
          alert('Login successful as admin.');
          navigate('/admin-dashboard'); // Ensure this path matches the route for the admin dashboard
        } else if (role && role.toLowerCase() === 'organizer') {
          alert('Login successful as organizer.');
          navigate('/organizer-dashboard');
        } else {
          alert('Login successful.');
          navigate('/'); // Default navigation for other roles like players
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
