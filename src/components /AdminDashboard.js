import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [organizers, setOrganizers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch organizers and matches
  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizersRes = await axios.get('http://localhost:5000/api/admin/organizers');
        const matchesRes = await axios.get('http://localhost:5000/api/admin/matches');
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
      await axios.put(`http://localhost:5000/api/admin/organizer/${id}/verify`);
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
              {match.player1} vs {match.player2}
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
