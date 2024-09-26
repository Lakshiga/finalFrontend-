import React, { useState } from 'react';
import axios from 'axios';
import '../css/CreateMatch.css'; // Import the CSS file

const CreateMatch = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !type.trim() || !player1.trim() || !player2.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    const players = [player1, player2];

    // Retrieve token from local storage or context
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/matches/match',
        { name, type, players },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 201 || res.data.msg === 'Match created successfully') {
        // Show success alert and reset form
        alert('Match created successfully');
        setName('');
        setType('');
        setPlayer1('');
        setPlayer2('');
        setError('');
      } else {
        setError('Failed to create match.');
      }
    } catch (error) {
      setError(error.response?.data?.msg || 'Error creating match.');
      console.error('Error creating match:', error.response?.data || error.message);
    }
  };

  return (
    <div className="create-match-container">
      <h1>Create Match</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Match Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Match Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Player 1"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Player 2"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          required
        />
        <button type="submit">Create Match</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CreateMatch;
