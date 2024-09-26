import React, { useState } from 'react';
import axios from 'axios';
import '../css/UpdateScore.css'; // Import the CSS file
import { useParams } from 'react-router-dom';

const UpdateScore = () => {
  const { id } = useParams(); // Retrieve the match ID from the URL
  const [score, setScore] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with the correct endpoint for updating the score
      const res = await axios.put(`http://localhost:5000/api/matches/update-score${id}`, {
        score,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add authorization header
        },
      });

      if (res.status === 200) {
        alert('Score updated successfully');
        setScore('');
        setError('');
      } else {
        setError('Failed to update score.');
      }
    } catch (error) {
      setError(error.response?.data?.msg || 'Error updating score.');
    }
  };

  return (
    <div className="update-score-container">
      <h1>Update Score</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Score (e.g., 3-2)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
        />
        <button type="submit">Update Score</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default UpdateScore;
