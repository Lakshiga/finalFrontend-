import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '/home/uki-admin02/Documents/Lachchu/Match Lachchu final/Match Lachchu/Match /frontend/src/css/AdminDashboard.css';

const AdminDashboard = () => {
  const [organizers, setOrganizers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch organizers and matches
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure the token is sent in headers
        const organizersRes = await axios.get('http://localhost:5000/api/admin/organizers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const matchesRes = await axios.get('http://localhost:5000/api/admin/matches', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrganizers(organizersRes.data);
        setMatches(matchesRes.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle organizer verification
  const verifyOrganizer = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Ensure the token is sent in headers
      await axios.put(`http://localhost:5000/api/admin/organizer/${id}/verify`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrganizers(organizers.map(org => org._id === id ? { ...org, verified: true } : org));
    } catch (error) {
      setError('Verification failed.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Organizers</h3>
        {organizers.length > 0 ? (
          organizers.map((org) => (
            <div key={org._id}>
              {org.name} - {org.verified ? 'Verified' : 'Pending'}
              {!org.verified && (
                <button onClick={() => verifyOrganizer(org._id)}>Verify</button>
              )}
            </div>
          ))
        ) : (
          <p>No organizers found</p>
        )}
      </section>

      <section>
        <h3>Matches</h3>
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match._id}>
              Match: {match.player1} vs {match.player2} - {match.status}
              {/* Additional match details and actions can be added here */}
            </div>
          ))
        ) : (
          <p>No matches found</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;


     
