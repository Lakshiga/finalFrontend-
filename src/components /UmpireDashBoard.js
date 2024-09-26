import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UmpireDashboard = ({ umpireId }) => {
  const [matches, setMatches] = useState([]);
  const [finishedMatches, setFinishedMatches] = useState([]);

  useEffect(() => {
    // Fetch matches assigned to the umpire
    axios
      .get(`/api/matches/umpire/${umpireId}`)
      .then((res) => setMatches(res.data))
      .catch((err) => console.error(err));
  }, [umpireId]);

  const updateScore = (matchId, player1Score, player2Score) => {
    axios
      .put(`/api/matches/update-score/${matchId}`, { player1Score, player2Score })
      .then((res) => {
        // Refresh the match list after the score is updated
        setMatches(matches.filter((match) => match._id !== matchId));
        setFinishedMatches([...finishedMatches, res.data.match]);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    // Fetch finished matches
    axios
      .get('/api/matches/finished')
      .then((res) => setFinishedMatches(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Umpire Dashboard</h2>
      <h3>Assigned Matches</h3>
      {matches.length > 0 ? (
        matches.map((match) => (
          <div key={match._id}>
            <p>{match.player1} vs {match.player2}</p>
            <input type="number" placeholder="Player 1 Score" id={`p1Score-${match._id}`} />
            <input type="number" placeholder="Player 2 Score" id={`p2Score-${match._id}`} />
            <button
              onClick={() => {
                const player1Score = document.getElementById(`p1Score-${match._id}`).value;
                const player2Score = document.getElementById(`p2Score-${match._id}`).value;
                updateScore(match._id, player1Score, player2Score);
              }}
            >
              Submit Score
            </button>
          </div>
        ))
      ) : (
        <p>No matches assigned</p>
      )}

      <h3>Finished Matches</h3>
      {finishedMatches.length > 0 ? (
        finishedMatches.map((match) => (
          <div key={match._id}>
            <p>{match.player1} vs {match.player2}</p>
            <p>Score: {match.score.player1Score} - {match.score.player2Score}</p>
            <p>Status: {match.status}</p>
          </div>
        ))
      ) : (
        <p>No finished matches</p>
      )}
    </div>
  );
};

export default UmpireDashboard;
