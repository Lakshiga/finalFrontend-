import React from 'react';
import '../css/About.css'; // Ensure you have an About.css file for styling

const About = () => {
  return (
    <div className="about-page">
      <header>
        <h1>About Us</h1>
      </header>
      <main>
        <section className="about-content">
          <h2>Our Mission</h2>
          <p>
            At [Your Company Name], our mission is to revolutionize the way sports events are managed. We provide a comprehensive platform that enables organizers to seamlessly schedule and manage tournaments, track scores, and oversee event logistics.
          </p>
          <h2>Our Vision</h2>
          <p>
            We envision a world where sports management is streamlined and accessible to all. Our platform aims to empower organizers, umpires, and players with tools that enhance their experience and contribute to the success of every event.
          </p>
          <h2>Our Team</h2>
          <p>
            Our team consists of dedicated professionals with a passion for sports and technology. We are committed to delivering the best user experience and continuously improving our platform based on user feedback and industry trends.
          </p>
        </section>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} [Your Company Name]. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
