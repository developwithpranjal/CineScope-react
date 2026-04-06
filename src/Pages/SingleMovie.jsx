import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { baseImageUrl } from "../data";
import { FaStar, FaCalendarAlt, FaRegPlayCircle } from "react-icons/fa";
import { MovieContext } from "../Components/Router";
import { BsBookmarkPlusFill } from "react-icons/bs";
import "./SingleMovie.css";
import LocationData from "./LocationData";

function SingleMovie() {
  const location = useLocation();
  const { id } = useParams();
  const isTV = location.pathname.includes("/tv");
  const [cast, setCast] = useState([]);
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const { Location, city, error, loading, getLocation, theaters } =
    LocationData();
  const { AddToWatchlist, RemoveFromWatchList, isInwatchlist } =
    useContext(MovieContext);

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
    setMovie(result);
    console.log(result);

    const credits = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${API_KEY}`,
    );
    const creditData = await credits.json();

    setCast(creditData.cast || []);
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
      setShowTrailer(true);
    }
  }
  function OpenForBooking(movie, city) {
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(movie + "showtimes" + city)}`,
      "_blank",
    );
  }
  if (!movie) {
    return (
      <div className="single-movie">
        <div className="movie-left">
          <div className="skeleton skeleton-img"></div>
        </div>

        <div className="movie-right">
          <div className="movie-description">
            <div className="movie-info">
              <div className="skeleton skeleton-title"></div>

              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text small"></div>

              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>

              <div className="skeleton skeleton-btn"></div>
              <div className="skeleton skeleton-btn"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="single-movie"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
        }}
      >
        <div className="movie_container">
          <div className="movie-left">
            <img
              src={`${baseImageUrl}${movie.poster_path}`}
              alt={movie.title || movie.name}
            />
          </div>

          <div className="movie-right">
            <div className="movie-description">
              <div className="movie-info">
                <h1>{movie.title || movie.name}</h1>

                <span>Description: </span>
                <p>{movie.overview}</p>

                <p>
                  <span>Genre: </span>
                  {movie.genres?.map((e) => e.name).join(", ") || "N/A"}
                </p>

                <p>
                  <span>
                     Release Date:{" "}
                  </span>
                  {movie.release_date || movie.first_air_date || "N/A"}
                </p>

                <p className="rating">
                  <span>Rating: </span>
                  <FaStar />{" "}
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  /10
                </p>

                <p className="language">
                  <span>Language: </span>
                  {movie.spoken_languages
                    ?.map((e) => e.english_name)
                    .join(", ") || "N/A"}
                </p>

                <button className="TrailerBtn" onClick={handleTrailer}>
                  <FaRegPlayCircle />{" "}
                  {showTrailer ? "Close Trailer" : "Watch Trailer"}
                </button>

                <button
                  className="WatchListBtn"
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
              <div className="location-box">
                <button onClick={getLocation} className="location-btn">
                  Find Nearest Theater
                </button>

                {loading && <p className="location-text">Loading...</p>}
                {error && <p className="location-text">{error}</p>}

                {Location && (
                  <p className="location-coords">
                  </p>
                )}

                {city && <p className="location-text">📍 {city}</p>}
              </div>
              {theaters && theaters.length > 0 && (
                <div className="theater-list">
                  <h3>Nearby Theaters 🎬</h3>

                  {theaters.slice(0, 5).map((t) => (
                    <div key={t.id} className="theater-card">
                      <p>
                        <p
                          className="theater-name"
                          onClick={() =>
                            OpenForBooking(movie.title || movie.name, city)
                          }
                        >
                          <b>{t.tags.name || "Cinema"}</b>
                        </p>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="cast-wrapper">
        <h2 className="cast-heading">Cast</h2>

        <div className="cast-container">
          {cast.slice(0, 12).map((actor) => (
            <Link to={`/person/${actor.id}`} key={actor.id}>
              <div className="cast-card">
                {actor.profile_path ? (
                  <img
                    src={`${baseImageUrl}${actor.profile_path}`}
                    alt={actor.name}
                  />
                ) : (
                  <div className="no-image"></div>
                )}

                <p>{actor.name}</p>
                <p className="character-name">as {actor.character}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default SingleMovie;
