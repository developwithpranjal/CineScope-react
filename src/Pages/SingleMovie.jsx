import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseImageUrl } from "../data";
import { FaStar } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { useContext } from "react";
import { MovieContext } from "../Components/Router";
import "./SingleMovie.css";
function SingleMovie() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  let { AddToWatchlist } = useContext(MovieContext);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  async function fetchMovie() {
    const API_KEY = import.meta.env.VITE_API_KEY;

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
    );

    const result = await response.json();
    console.log(result);

    setMovie(result);
  }
  async function handleTrailer() {
    if (showTrailer) {
      setShowTrailer(false);
      return;
    }

    const API_KEY = import.meta.env.VITE_API_KEY;

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`,
    );

    const data = await res.json();

    const trailer = data.results.find(
      (vid) => vid.type === "Trailer" && vid.site === "YouTube",
    );

    if (trailer) {
      setTrailer(trailer.key);
      console.log(trailer);

      setShowTrailer(true);
    }
  }
  if (!movie) return <h2>Loading...</h2>;

  return (
    <div className="single-movie">
      <div className="movie-left">
        <img src={`${baseImageUrl}${movie.poster_path}`} alt={movie.title} />
      </div>

      <div className="movie-right">
        <div className="movie-description">
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <span>Description: </span>

            {movie.overview}
            <p>
              <span>Genre: </span>
              {movie.genres[0].name}
            </p>
            <p>
              <FaCalendarAlt />
              <span> Release Date:</span> {movie.release_date}
            </p>

            <p className="rating">
              <span>Rating: </span>
              <FaStar /> {movie.vote_average.toFixed(1)}/10
            </p>
            <button className="TrailerBtn" onClick={handleTrailer}>
              {showTrailer ? "Close Trailer" : "Watch Trailer"}
            </button>
            <button
              className="WatchListBtn"
              onClick={() => AddToWatchlist(movie)}
            >
              + Add to WatchList
            </button>
            {showTrailer && trailerKey && (
              <div className="trailer-overlay">
                <div className="trailer-box">
                  <button
                    className="close-btn"
                    onClick={() => setShowTrailer(false)}
                  >
                    Close ✖
                  </button>

                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title="Trailer"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SingleMovie;
