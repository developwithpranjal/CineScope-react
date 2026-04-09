import React, { useState, useEffect, useRef, useContext } from "react";
import { GiFilmProjector } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { MovieContext } from "./Router";
import "./Header.css";

const dummyPerson = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const dummyPoster = "https://via.placeholder.com/92x138?text=No+Image";

const Header = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [genres, setGenres] = useState([]);

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { handleLogout, user } = useContext(MovieContext);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      const API_KEY = import.meta.env.VITE_API_KEY;

      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`,
      );

      const data = await res.json();
      setSuggestions(data.results?.slice(0, 6) || []);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchGenres() {
      const API_KEY = import.meta.env.VITE_API_KEY;

      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
      );

      const data = await res.json();
      setGenres(data.genres || []);
    }

    fetchGenres();
  }, []);

  function handleClick(item) {
    const type = item.media_type;
    navigate(`/${type}/${item.id}`);
    setQuery("");
    setSuggestions([]);
  }

  return (
    <header className="Header">
      {/* 🔹 LOGO */}
      <div className="logo">
        <Link to={"/"}>
          <GiFilmProjector />
          CineScope
        </Link>
      </div>

      <div className="search-wrapper" ref={searchRef}>
        <div className="genre-inline">
          <select
            onChange={(e) => {
              if (e.target.value) {
                navigate(`/genre/${e.target.value}`);
              }
            }}
          >
            <option value="">All</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

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
                        : dummyPerson
                      : item.poster_path
                        ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                        : dummyPoster
                  }
                  alt={item.title || item.name}
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
        <Link to={"/watchlist"}>
          <BsBookmarkHeartFill /> WatchList
        </Link>

        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
        <Link to="/profile">Profile</Link>
      </div>
    </header>
  );
};

export default Header;
