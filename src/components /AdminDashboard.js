import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '/home/uki-admin02/Documents/Lachchu/Match Lachchu final/Match Lachchu/Match /frontend/src/css/AdminDashboard.css';

const AdminDashboard = () => {
  const [organizers, setOrganizers] = useState([]);
  const [verifyingOrganizer, setVerifyingOrganizer] = useState(null); // Store verifying organizer ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/admin/unverified-organizers', config);
        setOrganizers(res.data);
      } catch (err) {
        console.error('Error fetching unverified organizers:', err);
        if (err.response && err.response.status === 401) {
          navigate('/login'); // Redirect to login if unauthorized
        } else {
          setError('Failed to load organizers. Please try again later.');
        }
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };
    fetchOrganizers();
  }, [token, navigate]);

  const verifyOrganizer = async (id) => {
    setVerifyingOrganizer(id); // Show "Verifying..." for the specific organizer
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/admin/verify/${id}`, {}, config);
      // Remove verified organizer from the list
      setOrganizers((prev) => prev.filter((org) => org._id !== id));
      alert('Organizer verified successfully!');
    } catch (err) {
      console.error('Error verifying organizer:', err);
      setError('Failed to verify organizer.');
    } finally {
      setVerifyingOrganizer(null); // Reset verifying state
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>; // Loading spinner
  }

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
      </header>

      {error && <p className="error-message">{error}</p>}

      <h2>Unverified Organizers</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Organization</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {organizers.length > 0 ? (
            organizers.map((org) => (
              <tr key={org._id}>
                <td>{org.name}</td>
                <td>{org.email}</td>
                <td>{org.organizationName}</td>
                <td>
                  <button
                    onClick={() => verifyOrganizer(org._id)}
                    disabled={verifyingOrganizer === org._id}
                  >
                    {verifyingOrganizer === org._id ? 'Verifying...' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No unverified organizers found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <footer>
        <p>Admin Dashboard © 2024</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
