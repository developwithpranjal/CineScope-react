import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { baseImageUrl } from "../data";
import { FaStar, FaCalendarAlt, FaRegPlayCircle } from "react-icons/fa";
import { MovieContext } from "../Components/Router";
import { BsBookmarkPlusFill } from "react-icons/bs";
import "./SingleMovie.css";
import LocationData from "./LocationData";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
function SingleMovie() {
  const location = useLocation();
  const { id } = useParams();
  const isTV = location.pathname.includes("/tv");
  const [cast, setCast] = useState([]);
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [customReviews, setCustomReviews] = useState([]);

  const { Location, city, error, loading, getLocation, theaters } =
    LocationData();
  const { AddToWatchlist, RemoveFromWatchList, isInwatchlist, user } =
    useContext(MovieContext);
  const navigate = useNavigate();
  useEffect(() => {
    fetchMovie();
    fetchCustomReviews();
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
    const reviewRes = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=${API_KEY}`,
    );

    const reviewData = await reviewRes.json();
    console.log(reviewData);
    setReviews(reviewData.results || []);
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
  async function handleSubmitReview() {
    if (!user) {
      toast.info("Login required first");
      return;
    }

   

    try {
      await addDoc(collection(db, "reviews"), {
        movieId: id,
        userName: user.email.split("@")[0].replace(/[0-9.]/g," "),
        review: userReview,
        createdAt: new Date(),
      });

      toast.success("Review Added ✅");

      setUserReview("");
      setUserRating(0);

      fetchCustomReviews();
    } catch (err) {
      console.log(err);
    }
  }
  async function fetchCustomReviews() {
    const snapshot = await getDocs(collection(db, "reviews"));

    const data = snapshot.docs
      .map((doc) => doc.data())
      .filter((r) => r.movieId === id);

    setCustomReviews(data);
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
                  <span>Release Date: </span>
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
                  onClick={() => {
                    if (!user) {
                      toast.warning("Please login first ⚠️");
                      navigate("/login");
                      return;
                    }

                    if (isInwatchlist(movie.id)) {
                      RemoveFromWatchList(movie.id);
                      toast.error("Removed from Watchlist ❌");
                    } else {
                      AddToWatchlist(movie);
                      toast.success("Added to Watchlist ✅");
                    }
                  }}
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

                {Location && <p className="location-coords"></p>}

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
      <div className="reviews-wrapper">
        <h2 className="reviews-heading">Reviews</h2>

        <div className="reviews-container">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews available 😢</p>
          ) : (
            reviews.slice(0, 5).map((review) => (
              <div className="review-card" key={review.id}>
                <h4>{review.author}</h4>
                <p>⭐ {review.author_details?.rating || "N/A"}</p>
                <p className="review-content">
                  {review.content.slice(0, 150)}...
                </p>
              </div>
            ))
          )}
        </div>
        <div className="custom-reviews-list">
          <h2 className="reviews-heading">User Reviews</h2>

          {customReviews.length === 0 ? (
            <p className="no-reviews">No user reviews yet 😢</p>
          ) : (
            <div className="reviews-container">
              {customReviews.map((r, i) => (
                <div key={i} className="review-card">
                  <h4 className="review-author">{r.userName}</h4>


                  <p className="review-content">{r.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="custom-review-section">
        <h2 className="reviews-heading">Add Your Review</h2>

        <textarea
          className="review-textarea"
          placeholder="Write your review..."
          value={userReview}
          onChange={(e) => setUserReview(e.target.value)}
        />

        

        <button className="submit-review-btn" onClick={handleSubmitReview}>
          Submit Review
        </button>
      </div>
    </>
  );
}

export default SingleMovie;
