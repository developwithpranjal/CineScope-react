import { useContext, useEffect, useState } from "react";
import { baseImageUrl } from "../data";
import "./Home.css";
import { Link } from "react-router-dom";
import { BsBookmarkPlusFill, BsBookmarkCheckFill } from "react-icons/bs";
import { MovieContext } from "../Components/Router";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Home({ urls, heading, btn1, btn2 }) {
  const [movieData, setMovieData] = useState([]);
  const [showData, setShowData] = useState(urls);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  let { AddToWatchlist, RemoveFromWatchList, isInwatchlist, user } =
    useContext(MovieContext);

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);

        const response = await Promise.all(showData.map((url) => fetch(url)));

        const result = await Promise.all(response.map((res) => res.json()));
        const combinedData = result.flatMap((r) => r.results || []);

        setMovieData(combinedData);
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

  const isPerson = showData.some((url) => url.includes("person"));
const isTV = showData.some((url) => url.includes("tv"));

  return (
    <section className="home-section">
      <header className="home-header">
        <h2>{heading}</h2>
        {!isPerson && (
          <div className="toggle-buttons">
            <button className={showData[0]===urls[0]?"active-btn":""} onClick={() => setShowData([urls[0]])}>
              {btn1}
            </button>

            <button className={showData[0]===urls[1]?"active-btn":""} onClick={() => setShowData([urls[1]])}>{btn2}</button>
          </div>
        )}
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
          movieData.map((item,index) => (
            <div
              key={index}
              className={item.profile_path ? "celeb-card" : "movie-card"}
            >
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
                    if (!user) {
                      toast.warning("Please login first ⚠️");
                      navigate("/login");
                      return;
                    }

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
