import React, { useContext } from "react";
import { MovieContext } from "../Components/Router";
import { baseImageUrl } from "../data";
import { Link } from "react-router-dom";
import { BsBookmarkXFill } from "react-icons/bs";
import "./Home.css";

const WatchList = () => {
  const { Watchlist, RemoveFromWatchList } = useContext(MovieContext);

  function trimContent(content) {
    if (!content) return "";
    return content.length > 20 ? content.slice(0, 20) + "..." : content;
  }

  return (
    <div className="home-section">
      <h2>Your WatchList</h2>

      <div className="movie-grid">
        {Watchlist.length > 0 ? (
          Watchlist.map((item) => {
            const isTV = item.name !== undefined;
            const isPerson = item.profile_path !== undefined;
            return (
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
                      src={`${baseImageUrl}${item.poster_path || item.profile_path}`}
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
                  <span className="removebtn">
                    <BsBookmarkXFill
                      onClick={() => RemoveFromWatchList(item.id)}
                    />
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p>No movies in WatchList 😢</p>
        )}
      </div>
    </div>
  );
};

export default WatchList;
