import React from "react";
import { FaGithub, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-accent" />

      <div className="footer-container">

        <div className="footer-brand">
          <h2>CineScope</h2>
          <p className="footer-tagline">
            Your ultimate movie discovery platform.<br />
            Find, track, and explore what to watch next.
          </p>
          <p className="footer-made">Made with <span>★</span> by Pranjal Agrawal</p>
        </div>

        <div className="footer-col">
          <h4>Navigate</h4>
          <Link to="/">Home</Link>
          <Link to="/watchlist">Watchlist</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer-col">
          <h4>Discover</h4>
          <a href="#">Trending</a>
          <a href="#">Top Rated</a>
          <a href="#">Upcoming</a>
        </div>

        <div className="footer-col">
          <h4>Follow</h4>
          <div className="social-icons">
            <a href="#" className="social-icon" title="GitHub" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="#" className="social-icon" title="Twitter" aria-label="Twitter">
              <FaXTwitter />
            </a>
            <a href="#" className="social-icon" title="Instagram" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CineScope <span className="dot">•</span> All rights reserved</p>
        <span className="footer-badge">Powered by TMDB API</span>
      </div>
    </footer>
  );
};

export default Footer;