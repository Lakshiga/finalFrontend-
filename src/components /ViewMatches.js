import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ViewMatch.css'; // Import the CSS file
import { useParams } from 'react-router-dom';

const ViewMatch = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/matches/view-match${id}`);
        setMatch(res.data.match);
      } catch (err) {
        console.error('Error fetching match details:', err);
        setError('Error fetching match details.');
      }
    };

    fetchMatch();
  }, [id]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!match) {
    return <p>Loading...</p>;
  }

  return (
    <div className="view-match-container">
      <h1>Match Details</h1>
      <p><strong>Event:</strong> {match.event.name}</p>
      <p><strong>Player 1:</strong> {match.player1}</p>
      <p><strong>Player 2:</strong> {match.player2}</p>
      <p><strong>Score:</strong> {match.score || 'Not updated yet'}</p>
    </div>
  );
};

export default ViewMatch;

       
