import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '/home/uki-admin02/Documents/Lachchu/Match Lachchu final/Match Lachchu/Match /frontend/src/css/OrganizerDashboard.css'

const OrganizerDashboard = () => {
  const [eventData, setEventData] = useState({
    name: '',
    matchType: 'League',
    players: '',
    umpires: ''
  });
  const [umpireVerifications, setUmpireVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  useEffect(() => {
    const fetchUmpireVerifications = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await axios.get('/api/organizer/unverified-umpires', config);
        setUmpireVerifications(res.data);
      } catch (error) {
        console.error('Error fetching umpire verifications:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to load umpire verifications');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUmpireVerifications();
  }, [token, navigate]);

  const onChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const players = eventData.players.split(',').map((p) => p.trim());
    const umpires = eventData.umpires.split(',').map((u) => u.trim());

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.post('/api/events/create-event', { ...eventData, players, umpires }, config);

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

  const verifyUmpire = async (id) => {
    setVerifying(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post(`/api/organizer/verify-umpire/${id}`, {}, config);

      setUmpireVerifications((prev) =>
        prev.filter((ump) => ump._id !== id)
      );
      alert('Umpire verified successfully');
    } catch (error) {
      console.error('Error verifying umpire:', error);
      setError('Failed to verify umpire');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Organizer Dashboard</h1>

      {/* Create Event Form */}
      <form onSubmit={onSubmit}>
        <div>
          <label>Event Name</label>
          <input type="text" name="name" value={eventData.name} onChange={onChange} required />
        </div>
        <div>
          <label>Match Type</label>
          <select name="matchType" value={eventData.matchType} onChange={onChange}>
            <option value="League">League</option>
            <option value="Knockout">Knockout</option>
          </select>
        </div>
        <div>
          <label>Players (comma-separated)</label>
          <input type="text" name="players" value={eventData.players} onChange={onChange} required />
        </div>
        <div>
          <label>Umpires (comma-separated)</label>
          <input type="text" name="umpires" value={eventData.umpires} onChange={onChange} required />
        </div>
        <button type="submit">Create Event</button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Umpire Verifications */}
      <section>
        <h2>Umpire Verifications</h2>
        {umpireVerifications.length === 0 ? (
          <p>No umpire verifications pending</p>
        ) : (
          <ul>
            {umpireVerifications.map((ump) => (
              <li key={ump._id}>
                {ump.name} - {ump.verified ? 'Verified' : 'Not Verified'}
                {!ump.verified && (
                  <button onClick={() => verifyUmpire(ump._id)} disabled={verifying}>
                    {verifying ? 'Verifying...' : 'Verify'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default OrganizerDashboard;
