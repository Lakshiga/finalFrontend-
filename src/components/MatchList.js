import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/MatchList.css'; // Import the CSS file

const MatchList = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/matches/match');
        setMatches(res.data.matches);
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="match-list-container">
      <h1>Match List</h1>
      <ul>
        {matches.map((match) => (
          <li key={match._id}>
            <span>{match.player1} vs {match.player2}</span>
            <a href={`/view-match/${match._id}`}>View Details</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
