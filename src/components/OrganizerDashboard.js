import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/OrganizerDashboard.css';

const OrganizerDashboard = () => {
  const [eventData, setEventData] = useState({
    name: '',
    matchType: 'League',
    players: '',
    umpires: ''
  });
  const [matchData, setMatchData] = useState({
    eventName: '',
    player1: '',
    player2: '',
    umpire: ''
  });
  const [umpireVerifications, setUmpireVerifications] = useState([]);
  const [playerVerifications, setPlayerVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrganizerStatus = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/organizer/organizer/status', config);
        setIsVerified(res.data.verified);
      } catch (error) {
        console.error('Error fetching organizer status:', error);
        setError('Failed to load organizer status');
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    const fetchUmpireVerifications = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/organizer/unverified-umpires', config);
        setUmpireVerifications(res.data);
      } catch (error) {
        console.error('Error fetching umpire verifications:', error);
        setError('Failed to load umpire verifications');
      }
    };

    const fetchPlayerVerifications = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/organizer/unverified-players', config);
        setPlayerVerifications(res.data);
      } catch (error) {
        console.error('Error fetching player verifications:', error);
        setError('Failed to load player verifications');
      }
    };

    fetchOrganizerStatus();
    fetchUmpireVerifications();
    fetchPlayerVerifications();
    setLoading(false);
  }, [token, navigate]);

  const onChangeEvent = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const onChangeMatch = (e) => {
    setMatchData({ ...matchData, [e.target.name]: e.target.value });
  };

  const onSubmitEvent = async (e) => {
    e.preventDefault();
    const players = eventData.players.split(',').map((p) => p.trim());
    const umpires = eventData.umpires.split(',').map((u) => u.trim());

    const allPlayersVerified = players.every((player) =>
      playerVerifications.some((p) => p.name === player && p.verified)
    );
    const allUmpiresVerified = umpires.every((umpire) =>
      umpireVerifications.some((u) => u.name === umpire && u.verified)
    );

    if (!allPlayersVerified || !allUmpiresVerified) {
      setError('All players and umpires must be verified before creating an event.');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.post('http://localhost:5000/api/events/create-event', { ...eventData, players, umpires }, config);

      if (res.status === 201) {
        setSuccess('Event created successfully!');
        setEventData({ name: '', matchType: 'League', players: '', umpires: '' });
      } else {
        setError('Failed to create event');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Server error');
    }
  };

  const onSubmitMatch = async (e) => {
    e.preventDefault();
    const { eventName, player1, player2, umpire } = matchData;

    if (!eventName || !player1 || !player2 || !umpire) {
      setError('All fields are required for match creation.');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.post('http://localhost:5000/api/matches/create-match', { eventName, player1, player2, umpire }, config);

      if (res.status === 201) {
        setSuccess('Match created successfully!');
        setMatchData({ eventName: '', player1: '', player2: '', umpire: '' });
      } else {
        setError('Failed to create match');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Server error');
    }
  };

  const checkVerificationStatus = async () => {
    if (isVerified) {
      return; // Already verified, no action needed
    }

    alert('Please wait for admin verification.');
  };

  const verifyUmpire = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`http://localhost:5000/api/users/verify-umpire/${id}`, {}, config);
      setUmpireVerifications((prev) => prev.filter((ump) => ump._id !== id));
      alert('Umpire verified successfully');
    } catch (error) {
      console.error('Error verifying umpire:', error);
      setError('Failed to verify umpire');
    }
  };

  const verifyPlayer = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`http://localhost:5000/api/users/verify-player/${id}`, {}, config);
      setPlayerVerifications((prev) => prev.filter((player) => player._id !== id));
      alert('Player verified successfully');
    } catch (error) {
      console.error('Error verifying player:', error);
      setError('Failed to verify player');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Organizer Dashboard</h1>

      {/* Check Verification Button */}
      <button onClick={checkVerificationStatus}>Check Verification Status</button>
      {isVerified ? (
        <div>
          {/* Displaying Event Creation Form */}
          <h2>Create Event</h2>
          <form onSubmit={onSubmitEvent}>
            <div>
              <label>Event Name</label>
              <input type="text" name="name" value={eventData.name} onChange={onChangeEvent} required />
            </div>
            <div>
              <label>Match Type</label>
              <select name="matchType" value={eventData.matchType} onChange={onChangeEvent}>
                <option value="League">League</option>
                <option value="Knockout">Knockout</option>
              </select>
            </div>
            <div>
              <label>Players (comma-separated)</label>
              <input type="text" name="players" value={eventData.players} onChange={onChangeEvent} required />
            </div>
            <div>
              <label>Umpires (comma-separated)</label>
              <input type="text" name="umpires" value={eventData.umpires} onChange={onChangeEvent} required />
            </div>
            <button type="submit">Create Event</button>
          </form>

          {/* Displaying Match Creation Form */}
          <h2>Create Match</h2>
          <form onSubmit={onSubmitMatch}>
            <div>
              <label>Event Name</label>
              <input type="text" name="eventName" value={matchData.eventName} onChange={onChangeMatch} required />
            </div>
            <div>
              <label>Player 1</label>
              <input type="text" name="player1" value={matchData.player1} onChange={onChangeMatch} required />
            </div>
            <div>
              <label>Player 2</label>
              <input type="text" name="player2" value={matchData.player2} onChange={onChangeMatch} required />
            </div>
            <div>
              <label>Umpire</label>
              <input type="text" name="umpire" value={matchData.umpire} onChange={onChangeMatch} required />
            </div>
            <button type="submit">Create Match</button>
          </form>

          {/* Displaying Errors or Success Messages */}
          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}

          {/* Verification Tables */}
          <h2>Umpire Verifications</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {umpireVerifications.map((umpire) => (
                <tr key={umpire._id}>
                  <td>{umpire.name}</td>
                  <td>
                    <button onClick={() => verifyUmpire(umpire._id)}>Verify</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Player Verifications</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {playerVerifications.map((player) => (
                <tr key={player._id}>
                  <td>{player.name}</td>
                  <td>
                    <button onClick={() => verifyPlayer(player._id)}>Verify</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h2>Waiting for Admin Verification...</h2>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
