import React, { useState } from 'react';
import axios from 'axios';
import '../css/Register.css'

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a user object with all the form data
    const newUser = {
      name,
      email,
      password,
      role
    };

    try {
      // Send the data to the backend API
      const response = await axios.post('http://localhost:5000/api/users/register', newUser);
      console.log('Response from server:', response);
      
      if (response.status === 200) {
        alert('User registered successfully!');
        // Clear the form after success
        setName('');
        setEmail('');
        setPassword('');
        setRole('');
        setError('');  // Clear any previous errors
      } else {
        setError('Failed to register user.');
      }
    } catch (error) {
      console.error('Error registering user:', error.response?.data || error.message);
      setError(error.response?.data?.msg || 'Error registering user.');
    }
  };

  return (
    <div className="App">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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

        <div className="role-selection">
          <h3>Select your role:</h3>
          <label>
            <input
              type="radio"
              name="role"
              value="Organizer"
              checked={role === 'Organizer'}
              onChange={(e) => setRole(e.target.value)}
              required
            />
            Organizer
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Umpire"
              checked={role === 'Umpire'}
              onChange={(e) => setRole(e.target.value)}
            />
            Umpire
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Player"
              checked={role === 'Player'}
              onChange={(e) => setRole(e.target.value)}
            />
            Player
          </label>
        </div>

        <button type="submit">Register</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
