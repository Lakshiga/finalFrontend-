import React from 'react';
import { Link } from 'react-router-dom';
import '../css/HomePage.css'; // Ensure this path is correct

const HomePage = () => {
  return (
    <div className="home-page">
      <header>
        <h1>Welcome to the Sports Management Platform</h1>
        <nav>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            {/* Add more navigation links if needed */}
          </ul>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h2>Your Ultimate Sports Management Solution</h2>
          <p>Manage tournaments, schedule matches, and track scores with ease.</p>
          <Link to="/register" className="cta-button">Get Started</Link>
        </section>

        <section className="features">
          <h2>Features</h2>
          <div className="feature">
            <h3>Organize Events</h3>
            <p>Create and manage sports events with different formats and age groups.</p>
          </div>
          <div className="feature">
            <h3>Role Management</h3>
            <p>Handle permissions for organizers, umpires, and players effectively.</p>
          </div>
          <div className="feature">
            <h3>Score Tracking</h3>
            <p>Update scores in real-time and determine winners automatically.</p>
          </div>
          {/* Add more features if needed */}
        </section>

        <section className="about">
          <h2>About Us</h2>
          <p>Learn more about our mission and vision for sports management.</p>
          <Link to="/about" className="cta-button">Read More</Link>
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Sports Management Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
