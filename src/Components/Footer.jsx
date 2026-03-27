import React from "react";
import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-logo">
          <h2>CineScope</h2>
          <p>Your ultimate movie discovery platform.</p>
          <p>Made By 💛 Pranjal Agrawal</p>
        </div>

        <div className="footer-links">
          <h4>Navigation</h4>
          <Link to="/">Home</Link>
          <Link to="/watchlist">WatchList</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer-links">
          <h4>Resources</h4>
          <a href="#">Trending Movies</a>
          <a href="#">Top Rated</a>
          <a href="#">Upcoming</a>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><FaGithub /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CineScope. All rights reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;