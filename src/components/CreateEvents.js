import React, { useState } from 'react';
import axios from 'axios';
import '../css/CreateEvent.css'; // Import the CSS file

const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('');
  const [description, setDescription] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [numPlayers, setNumPlayers] = useState(2);
  const [matchType, setMatchType] = useState('league');
  const [players, setPlayers] = useState(['']);
  const [error, setError] = useState('');

  const handlePlayerChange = (index, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = value;
    setPlayers(updatedPlayers);
  };

  const addPlayerField = () => {
    setPlayers([...players, '']);
    setNumPlayers(numPlayers + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!eventName.trim() || !eventDate.trim() || !eventType.trim() || !description.trim() ||
        !ageGroup.trim() || !gender.trim() || players.some(player => !player.trim())) {
      setError('Please fill out all fields correctly.');
      return;
    }

    const eventData = {
      name: eventName,
      date: eventDate,
      type: eventType,
      description,
      ageGroup,
      gender,
      numPlayers,
      matchType,
      players,
    };

    // Retrieve token from local storage or context
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/events', // Adjust the endpoint based on your API
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 201) {
        // Show success alert and reset form
        alert('Event created successfully');
        setEventName('');
        setEventDate('');
        setEventType('');
        setDescription('');
        setAgeGroup('');
        setGender('');
        setNumPlayers(2);
        setMatchType('league');
        setPlayers(['']);
        setError('');
      } else {
        setError('Failed to create event.');
      }
    } catch (error) {
      setError(error.response?.data?.msg || 'Error creating event.');
      console.error('Error creating event:', error.response?.data || error.message);
    }
  };

  return (
    <div className="create-event-container">
      <h1>Create Event</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Event Date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Event Type"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Age Group (e.g., U15, U20)"
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          required
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="mixed">Mixed</option>
        </select>
        <input
          type="number"
          placeholder="Number of Players"
          value={numPlayers}
          min="2"
          readOnly
        />
        <select
          value={matchType}
          onChange={(e) => setMatchType(e.target.value)}
        >
          <option value="league">League</option>
          <option value="knockout">Knockout</option>
        </select>

        {/* Player Fields */}
        {players.map((player, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Player ${index + 1}`}
            value={player}
            onChange={(e) => handlePlayerChange(index, e.target.value)}
            required
          />
        ))}
        <button type="button" onClick={addPlayerField}>Add Player</button>
        
        <button type="submit">Create Event</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CreateEvent;
