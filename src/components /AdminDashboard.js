import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    const fetchOrganizers = async () => {
      const res = await axios.get('/api/organizers'); // Add API to get all organizers
      setOrganizers(res.data.filter(org => !org.isVerified)); // Show only unverified organizers
    };
    fetchOrganizers();
  }, []);

  const verifyOrganizer = async (id) => {
    await axios.put(`/api/admin/verify-organizer/${id}`);
    setOrganizers(organizers.filter(org => org._id !== id)); // Remove verified organizer from list
  };

  return (
    <div>
      <h1>Admin Dashboard - Verify Organizers</h1>
      <ul>
        {organizers.map(org => (
          <li key={org._id}>
            {org.name} - {org.email}
            <button onClick={() => verifyOrganizer(org._id)}>Verify</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
