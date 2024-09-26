import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateEvent = ({ eventId }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the event details to pre-fill the form
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/event/${eventId}`);
        const event = res.data;
        setName(event.name);
        setDate(event.date);
        setLocation(event.location);
        setDescription(event.description);
      } catch (err) {
        console.error('Error fetching event details:', err.message);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim() || !date.trim() || !location.trim() || !description.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/events/event/${eventId}`,
        { name, date, location, description },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 200) {
        alert('Event updated successfully');
      } else {
        setError('Failed to update event.');
      }
    } catch (error) {
      setError(error.response?.data?.msg || 'Error updating event.');
      console.error('Error updating event:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <input
        type="text"
        placeholder="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="date"
        placeholder="Event Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Event Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <textarea
        placeholder="Event Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Update Event</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default UpdateEvent;
