import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseImageUrl } from "../data";
import { options } from "../data";
import "./SinglePerson.css";

function SinglePerson() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  useEffect(() => {
    async function fetchPerson() {
      const personURL = `https://api.themoviedb.org/3/person/${id}`;

      const movieURL = `https://api.themoviedb.org/3/person/${id}/movie_credits`;

      try {
        const [personRes, movieRes] = await Promise.all([
          fetch(personURL, options),
          fetch(movieURL, options),
        ]);

        const personData = await personRes.json();
        const movieData = await movieRes.json();

        setPerson(personData);

        setMovies(movieData.cast || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPerson();
  }, [id]);

  if (!person) {
    return (
      <div className="single-person">
        <div className="person-header">
          <div className="skeleton skeleton-img"></div>

          <div className="person-details">
            <div className="skeleton skeleton-title"></div>

            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text small"></div>

            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
        </div>

        <div className="movies-section">
          <h2>Movies</h2>

          <div className="movies-grid">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="movie-card">
                  <div className="skeleton skeleton-poster"></div>
                  <div className="skeleton skeleton-text small"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="single-person">
      <div className="person-header">
        {person.profile_path && (
          <img
            src={`${baseImageUrl}${person.profile_path}`}
            alt={person.name}
          />
        )}

        <div className="person-details">
          <h1>{person.name}</h1>

          <p>
            <b>Known For:</b> {person.known_for_department}
          </p>
          <p>
            <b>Birthday: </b>
            {person.birthday
              ? new Date(person.birthday).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })
              : ""}
          </p>
          <p>
            <b>Place of Birth:</b> {person.place_of_birth || "N/A"}
          </p>

          <p>
            <b>Biography:</b>{" "}
            {person.biography
              ? person.biography.slice(0, 600) + "..."
              : "No Biography Available"}
          </p>
        </div>
      </div>

      <div className="movies-section">
        <h2> Top Movies</h2>

        <div className="sp-movies-grid">
          {movies.length > 0 ? (
            movies
              .filter((m) => m.poster_path)
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, visibleCount)
              .map((movie) => (
                <div key={movie.id} className="sp-movie-card">
                  {movie.poster_path && (
                    <Link to={`/movie/${movie.id}`}>
                      <img
                        src={`${baseImageUrl}${movie.poster_path}`}
                        alt={movie.title}
                      />
                    </Link>
                  )}
                  <p>{movie.title}</p>
                </div>
              ))
          ) : (
            <p>No movies found</p>
          )}
        </div>
        {visibleCount < movies.length && (
          <button
            className="load-more-btn"
            onClick={() => setVisibleCount((prev) => prev + 10)}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

export default SinglePerson;
