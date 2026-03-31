import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseImageUrl } from "../data";
import "./SinglePerson.css"
function SinglePerson() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchPerson() {
      const API_KEY = import.meta.env.VITE_API_KEY;

      const res = await fetch(
        `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`,
      );
      const data = await res.json();
      setPerson(data);

      const movieRes = await fetch(
        `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}`,
      );
      const movieData = await movieRes.json();
      setMovies(movieData.cast || []);
    }

    fetchPerson();
  }, [id]);

  if (!person) return <h2>Loading...</h2>;

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

      <p><b>Known For:</b> {person.known_for_department}</p>
      <p><b>Birthday:</b> {person.birthday}</p>
      <p><b>Place of Birth:</b> {person.place_of_birth}</p>

      <p>
        <b>Biography:</b>{" "}
        {person.biography?person.biography.slice(0,400)+"...":"No Biography Available"}
      </p>
    </div>
  </div>

  <div className="movies-section">
    <h2>Movies</h2>

    <div className="movies-grid">
      {movies.length > 0 ? (
        movies
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 10)
          .map((movie) => (
            <div key={movie.id} className="movie-card">
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
  </div>
</div>
  );
}

export default SinglePerson;
