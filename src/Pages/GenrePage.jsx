import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseImageUrl } from "../data";
import { Link } from "react-router-dom";
import "./GenrePage.css";
const GenrePage = () => {
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);

        const API_KEY = import.meta.env.VITE_API_KEY;

        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${id}&page=${page}`,
        );

        const data = await res.json();

        setMovies((prev) => [...prev, ...(data.results || [])]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [id, page]);
  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [id]);

  return (
    <div className="genre-container">
      <h2>Movies</h2>

      <div className="genre-grid">
  {/* 🔹 FIRST LOAD SKELETON */}
  {loading && page === 1 &&
    Array(12)
      .fill(0)
      .map((_, i) => (
        <div className="film-card" key={i}>
          <div className="skeleton skeleton-img"></div>
          <div className="film-info">
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text small"></div>
          </div>
        </div>
      ))}

  {movies.map((movie,index) => (
    <div className="film-card" key={index}>
      <Link to={`/movie/${movie.id}`}>
        <img
          src={
            movie.poster_path
              ? `${baseImageUrl}${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={movie.title}
        />
      </Link>

      <div className="film-info">
        <p>{movie.title}</p>
      </div>
    </div>
  ))}
</div>
      {
        <div className="show-more-container">
  <button
    className="show-more-btn"
    disabled={loading}
    onClick={() => setPage((prev) => prev + 1)}
  >
    {loading && page > 1 ? "Loading..." : "Show More"}
  </button>
</div>
      }
    </div>
  );
};

export default GenrePage;
