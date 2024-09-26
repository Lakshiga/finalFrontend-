import React from 'react';
import axios from 'axios';

const DeleteEvent = ({ eventId, onEventDeleted }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/events/event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      alert('Event deleted successfully');
      onEventDeleted(); // Notify parent component to refresh the list or handle state
    } catch (error) {
      console.error('Error deleting event:', error.response?.data || error.message);
    }
  };

  return <button onClick={handleDelete}>Delete Event</button>;
};

export default DeleteEvent;
