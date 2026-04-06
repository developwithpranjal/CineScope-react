import React, { useState, useEffect } from "react";
import { GiFilmProjector } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MovieContext } from "./Router";
// import WatchList from "../Pages/WatchList";
// import SearchBar from "./SearchBar";
import "./Header.css";
const Header = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { handleLogout,user } = useContext(MovieContext);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      const API_KEY = import.meta.env.VITE_API_KEY;

      const res = await fetch(
        ` https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`,
      );

      const data = await res.json();

      setSuggestions(data.results?.slice(0, 6) || []);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  function handleClick(item) {
    const type = item.media_type;
    navigate(`/${type}/${item.id}`);
    setQuery("");
    setSuggestions([]);
  }

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
        <input
          type="text"
          placeholder="Search for Movies/Series"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="Searchbutton">
          <FaSearch />
        </button>
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((item) => (
              <div
                key={item.id}
                className="suggestion-item"
                onClick={() => handleClick(item)}
              >
                <img
                  src={
                    item.media_type === "person"
                      ? item.profile_path
                        ? `https://image.tmdb.org/t/p/w92${item.profile_path}`
                        : "https://via.placeholder.com/50"
                      : item.poster_path
                        ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                        : "https://via.placeholder.com/50"
                  }
                  alt=""
                />
                <div>
                  <p>{item.title || item.name}</p>
                  <span>{item.media_type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="navLinks">
        {" "}
        <Link to={"/watchlist"}>
          <BsBookmarkHeartFill /> WatchList
        </Link>
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
