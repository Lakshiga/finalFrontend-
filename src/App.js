import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components /HomePage';
import About from './components /About';
import Login from './components /Login';
import Register from './components /Register';
import CreateMatch from './components /CreateMatch';
import UpdateScore from './components /UpdateScore';
import ViewMatch from '../src/components /ViewMatches';
import MatchList from './components /MatchList';
import OrganizerLogin from './components /OrganizerLogin';
import AdminDashboard from './components /AdminDashboard';
import OrganizerDashboard from './components /OrganizerDashboard';
import PrivateRoute from './components /PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/organizer-login" element={<OrganizerLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-match" element={<CreateMatch />} />
          <Route path="/update-score/:id" element={<UpdateScore />} />
          <Route path="/view-match/:id" element={<ViewMatch />} />
          <Route path="/matches" element={<MatchList />} />
          
          {/* Protect Admin Dashboard */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Protect Organizer Dashboard */}
          <Route
            path="/organizer-dashboard"
            element={
              <PrivateRoute allowedRoles={['organizer']}>
                <OrganizerDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
