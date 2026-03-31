import { useParams,useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseImageUrl } from "../data";
import { FaStar } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { useContext } from "react";
import { MovieContext } from "../Components/Router";
import { BsBookmarkPlusFill } from "react-icons/bs";
import { FaRegPlayCircle } from "react-icons/fa";
import "./SingleMovie.css";
function SingleMovie() {
  const { id } = useParams();
let { AddToWatchlist, RemoveFromWatchList, isInwatchlist } =
    useContext(MovieContext);
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const isTV = location.pathname.includes("/tv");

  useEffect(() => {
    fetchMovie();
  }, [id, isTV]);

  async function fetchMovie() {
    const API_KEY = import.meta.env.VITE_API_KEY;

    const type = isTV ? "tv" : "movie";

    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`,
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

    const type = isTV ? "tv" : "movie";

    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`,
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
              {movie.genres.map((e)=>e.name).join(", ")||"N/A"}
            </p>
            <p>
              <span>
                <FaCalendarAlt /> Release Date:{" "}
              </span>
              {movie.release_date || movie.first_air_date}
            </p>

            <p className="rating">
              <span>Rating: </span>
              <FaStar /> {movie.vote_average.toFixed(1)}/10
            </p>
            <button className="TrailerBtn" onClick={handleTrailer}>
              <FaRegPlayCircle />{" "}
              {showTrailer ? "Close Trailer" : "Watch Trailer"}
            </button>
            <button
              onClick={() =>
                isInwatchlist(movie.id)
                  ? RemoveFromWatchList(movie.id)
                  : AddToWatchlist(movie)
              }
            >
              <BsBookmarkPlusFill />{" "}
              {isInwatchlist(movie.id) ? "Remove" : "Add To WatchList"}
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
