import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrganizerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      // Check if login is successful and token is received
      if (res.status === 200 && res.data.token) {
        // Save the token to localStorage
        localStorage.setItem('token', res.data.token);

        // Show success message
        alert('Organizer login successfully!');

        // Clear error and redirect to Organizer Dashboard
        setError('');
        navigate('/organizer-dashboard');
      } else {
        setError('Invalid login credentials');
      }
    } catch (error) {
      // If there's an error during login, display the error message
      setError('Error logging in. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <h1>Organizer Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {/* Display error message if there's an error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default OrganizerLogin;
