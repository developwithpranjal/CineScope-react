import React from "react";
import { GiFilmProjector } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import WatchList from "../Pages/WatchList";
import "./Header.css"
const Header = () => {
  return (
    <header className="Header">
      <div className="logo">
        <Link to={"/"}>
          {" "}
          <GiFilmProjector />
          CineScope
        </Link>
      </div>
      <div className="seacrhBar">
        <input type="text" placeholder="Search for Movies/Series" />
        <button className="Searchbutton">
          <FaSearch />
        </button>
      </div>
      <div className="navLinks">
        {" "}
        <Link to={"/watchlist"}><BsBookmarkHeartFill/> WatchList</Link>
        <Link className="loginbtn" to={"/login"}>Login</Link>
      </div>
    </header>
  );
};

export default Header;
