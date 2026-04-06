import { useContext, useEffect, useState } from "react";
import { baseImageUrl } from "../data";
import "./Home.css";
import { Link } from "react-router-dom";
import { BsBookmarkPlusFill, BsBookmarkCheckFill } from "react-icons/bs";
import { MovieContext } from "../Components/Router";
import { toast } from "react-toastify";

function Home({ urls, heading, btn1, btn2 }) {
  const [movieData, setMovieData] = useState([]);
  const [showData, setShowData] = useState(urls[0]);
  const [loading, setLoading] = useState(true);

  let { AddToWatchlist, RemoveFromWatchList, isInwatchlist } =
    useContext(MovieContext);

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);

        const response = await fetch(showData);
        const result = await response.json();

        setMovieData(result.results || []);
        console.log(result);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [showData]);

  function trimContent(content) {
    if (!content) return "";
    return content.length > 20 ? content.slice(0, 20) + "..." : content;
  }

  const isTV = showData.includes("tv");
  const isPerson = showData.includes("person");

  return (
    <section className="home-section">
      <header className="home-header">
        <h2>{heading}</h2>

        <div className="toggle-buttons">
          <button className="active-btn" onClick={() => setShowData(urls[0])}>
            {btn1}
          </button>

          <button onClick={() => setShowData(urls[1])}>{btn2}</button>
        </div>
      </header>

      <div className="movie-grid">
        {loading ? (
          Array(12)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="movie-card">
                <div className="skeleton skeleton-poster"></div>

                <div className="content">
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text small"></div>
                  <div className="skeleton skeleton-btn"></div>
                </div>
              </div>
            ))
        ) : movieData.length > 0 ? (
          movieData.map((item) => (
            <div key={item.id} className="movie-card">
              {(item.poster_path || item.profile_path) && (
                <Link
                  to={
                    isPerson
                      ? `/person/${item.id}`
                      : `/${isTV ? "tv" : "movie"}/${item.id}`
                  }
                >
                  <img
                    src={`${baseImageUrl}${
                      item.poster_path || item.profile_path
                    }`}
                    alt={item.title || item.name}
                  />
                </Link>
              )}

              <div className="content">
                <h3>{trimContent(item.title || item.name)}</h3>

                <p>
                  {item.release_date || item.first_air_date
                    ? new Date(
                        item.release_date || item.first_air_date,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                      })
                    : ""}
                </p>
                <button
                  onClick={() => {
                    if (isInwatchlist(item.id)) {
                      RemoveFromWatchList(item.id);
                      toast.error("Removed from Watchlist ❌");
                    } else {
                      AddToWatchlist(item);
                      toast.success("Added to Watchlist ✅");
                    }
                  }}
                  className="watchlist-icon"
                  title="Add To WatchList"
                >
                  {isInwatchlist(item.id) ? (
                    <BsBookmarkCheckFill />
                  ) : (
                    <BsBookmarkPlusFill />
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No Data To Show Yet!</p>
        )}
      </div>
    </section>
  );
}

export default Home;
