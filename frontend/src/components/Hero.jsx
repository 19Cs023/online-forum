import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import image from '../assets/powerful-technologies.jpg';

function Hero() {
  return (
    <section className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Online Forum</h1>
        <p className="hero-subtitle">
          Jumpstart your full-stack development with this robust Online Forum boilerplate. It features a scalable backend architecture, pre-configured authentication, React frontend with Vite, and state management using Zustand. Ready to build your next big idea!
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">Register</Link>
          <Link to="/signin" className="btn-secondary">Sign In</Link>
        </div>
      </div>
      <div className="hero-image">
        <img src={image} alt="Online Forum Overview" />
      </div>
    </section>
  );
}

export default Hero;