import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/OrganizerDashboard.css'; // Adjust this path based on your file structure

const OrganizerDashboard = () => {
  const [eventData, setEventData] = useState({
    name: '',
    matchType: 'League',
    players: '',
    umpires: '',
  });
  const [matchData, setMatchData] = useState({
    eventName: '',
    player1: '',
    player2: '',
    umpire: '',
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
    const fetchData = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch organizer status
        const organizerStatus = await axios.get('http://localhost:5000/api/organizer/status', config);
        setIsVerified(organizerStatus.data.verified);

        // Fetch umpire verifications
        const umpireRes = await axios.get('http://localhost:5000/api/organizer/unverified-umpires', config);
        setUmpireVerifications(umpireRes.data);

        // Fetch player verifications
        const playerRes = await axios.get('http://localhost:5000/api/organizer/unverified-players', config);
        setPlayerVerifications(playerRes.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data.');
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // Event form change handler
  const onChangeEvent = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // Match form change handler
  const onChangeMatch = (e) => {
    setMatchData({ ...matchData, [e.target.name]: e.target.value });
  };

  // Handle Event Submission
  const onSubmitEvent = async (e) => {
    e.preventDefault();
    const players = eventData.players.split(',').map((p) => p.trim());
    const umpires = eventData.umpires.split(',').map((u) => u.trim());

    // Ensure all players and umpires are verified
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
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.post(
        'http://localhost:5000/api/events/create-event',
        { ...eventData, players, umpires },
        config
      );

      if (res.status === 201) {
        setSuccess('Event created successfully!');
        setEventData({ name: '', matchType: 'League', players: '', umpires: '' });
      } else {
        setError('Failed to create event.');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Server error');
    }
  };

  // Handle Match Submission
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
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.post(
        'http://localhost:5000/api/matches/create-match',
        { eventName, player1, player2, umpire },
        config
      );

      if (res.status === 201) {
        setSuccess('Match created successfully!');
        setMatchData({ eventName: '', player1: '', player2: '', umpire: '' });
      } else {
        setError('Failed to create match.');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Server error');
    }
  };

  // Check Organizer Verification Status
  const checkVerificationStatus = () => {
    if (!isVerified) {
      alert('Please wait for admin verification.');
    }
  };

  // Verify Umpire Handler
  const verifyUmpire = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`http://localhost:5000/api/users/verify-umpire/${id}`, {}, config);
      setUmpireVerifications((prev) => prev.filter((ump) => ump._id !== id));
      alert('Umpire verified successfully');
    } catch (error) {
      console.error('Error verifying umpire:', error);
      setError('Failed to verify umpire.');
    }
  };

  // Verify Player Handler
  const verifyPlayer = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`http://localhost:5000/api/users/verify-player/${id}`, {}, config);
      setPlayerVerifications((prev) => prev.filter((player) => player._id !== id));
      alert('Player verified successfully');
    } catch (error) {
      console.error('Error verifying player:', error);
      setError('Failed to verify player.');
    }
  };

  // Display loading message if data is still being fetched
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="organizer-dashboard">
      <h1 className="dashboard-title">Organizer Dashboard</h1>

      <button className="check-verification-btn" onClick={checkVerificationStatus}>
        Check Verification Status
      </button>
      {isVerified ? (
        <div className="dashboard-forms">
          <div className="form-container">
            <h2>Create Event</h2>
            <form onSubmit={onSubmitEvent} className="event-form">
              <div className="form-group">
                <label>Event Name</label>
                <input type="text" name="name" value={eventData.name} onChange={onChangeEvent} required />
              </div>
              <div className="form-group">
                <label>Match Type</label>
                <select name="matchType" value={eventData.matchType} onChange={onChangeEvent}>
                  <option value="League">League</option>
                  <option value="Knockout">Knockout</option>
                </select>
              </div>
              <div className="form-group">
                <label>Players (comma-separated)</label>
                <input type="text" name="players" value={eventData.players} onChange={onChangeEvent} required />
              </div>
              <div className="form-group">
                <label>Umpires (comma-separated)</label>
                <input type="text" name="umpires" value={eventData.umpires} onChange={onChangeEvent} required />
              </div>
              <button type="submit" className="submit-btn">Create Event</button>
            </form>
          </div>

          <div className="form-container">
            <h2>Create Match</h2>
            <form onSubmit={onSubmitMatch} className="match-form">
              <div className="form-group">
                <label>Event Name</label>
                <input type="text" name="eventName" value={matchData.eventName} onChange={onChangeMatch} required />
              </div>
              <div className="form-group">
                <label>Player 1</label>
                <input type="text" name="player1" value={matchData.player1} onChange={onChangeMatch} required />
              </div>
              <div className="form-group">
                <label>Player 2</label>
                <input type="text" name="player2" value={matchData.player2} onChange={onChangeMatch} required />
              </div>
              <div className="form-group">
                <label>Umpire</label>
                <input type="text" name="umpire" value={matchData.umpire} onChange={onChangeMatch} required />
              </div>
              <button type="submit" className="submit-btn">Create Match</button>
            </form>
          </div>
        </div>
      ) : (
        <p>Please wait for verification before you can manage events and matches.</p>
      )}

      <div className="verification-lists">
        <h2>Umpire Verifications</h2>
        <table className="verification-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {umpireVerifications.map((umpire) => (
              <tr key={umpire._id}>
                <td>{umpire.name}</td>
                <td>{umpire.email}</td>
                <td>
                  <button className="verify-btn" onClick={() => verifyUmpire(umpire._id)}>
                    Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Player Verifications</h2>
        <table className="verification-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {playerVerifications.map((player) => (
              <tr key={player._id}>
                <td>{player.name}</td>
                <td>{player.email}</td>
                <td>
                  <button className="verify-btn" onClick={() => verifyPlayer(player._id)}>
                    Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default OrganizerDashboard;