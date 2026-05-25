import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Online Forum</h3>
          <p>A place to share knowledge, ask questions, and connect with other developers.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/signin">Sign In</a></li>
            <li><a href="/register">Sign Up</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Connect</h3>
          <ul>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Online Forum. Built from scratch.</p>
      </div>
    </footer>
  );
};

export default Footer;
