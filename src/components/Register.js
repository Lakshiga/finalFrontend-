import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Register.css';

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [certificationLevel, setCertificationLevel] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      name,
      email,
      password,
      role,
      contactNumber: role === 'Umpire' || role === 'Organizer' ? contactNumber : undefined,
      organizationName: role === 'Organizer' ? organizationName : undefined,
      organizationId: role === 'Organizer' ? organizationId : undefined,
      certificationLevel: role === 'Umpire' ? certificationLevel : undefined
    };

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', userData);

      if (response.status === 201) {
        setSuccess('User registered successfully!');
        alert('Registration successful!');
        navigate('/login');
      } else {
        setError('Failed to register user.');
      }
    } catch (error) {
      console.error('Error registering user:', error.response?.data || error.message);
      setError(error.response?.data?.msg || 'Error registering user.');
    }
  };

  return (
    <div className="App-register">
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="role-selection">
              <h3>Select your role:</h3>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="Organizer"
                  checked={role === 'Organizer'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Organizer
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="Umpire"
                  checked={role === 'Umpire'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Umpire
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="Player"
                  checked={role === 'Player'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Player
              </label>
            </div>
            <button type="button" onClick={() => setStep(2)}>Next</button>
          </>
        )}
        
        {step === 2 && role === 'Umpire' && (
          <>
            <input
              type="text"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Certification Level"
              value={certificationLevel}
              onChange={(e) => setCertificationLevel(e.target.value)}
              required
            />
            <button type="submit">Register</button>
          </>
        )}

        {step === 2 && role === 'Organizer' && (
          <>
            <input
              type="text"
              placeholder="Organization Name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Organization ID"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
            <button type="submit">Register</button>
          </>
        )}

        {step === 2 && role === 'Player' && (
          <>
            <button type="submit">Register</button>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;
