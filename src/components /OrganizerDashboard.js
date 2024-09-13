import React, { useState } from 'react';
import axios from 'axios';

const OrganizerDashboard = () => {
  const [eventData, setEventData] = useState({
    name: '',
    matchType: 'League',
    players: '',
    umpires: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = (e) => setEventData({ ...eventData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const players = eventData.players.split(',').map(p => p.trim());
    const umpires = eventData.umpires.split(',').map(u => u.trim());

    // Retrieve the token from local storage
    const token = localStorage.getItem('token');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Send the request to create an event
      const res = await axios.post(
        'http://localhost:5000/api/events/create-event', 
        { ...eventData, players, umpires }, 
        config
      );

      if (res.status === 201 || res.data.msg === 'Event created successfully') {
        setSuccess('Event created successfully!');
        setError('');
        setEventData({
          name: '',
          matchType: 'League',
          players: '',
          umpires: ''
        });
      } else {
        setError('Failed to create event');
        setSuccess('');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Server error');
      setSuccess('');
      console.error('Error creating event:', err);
    }
  };

  return (
    <div>
      <h1>Organizer Dashboard - Create Event</h1>
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

      {/* Show success or error messages */}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default OrganizerDashboard;
