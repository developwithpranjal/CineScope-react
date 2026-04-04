// import { useParams, Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { baseImageUrl } from "../data";

// function SingleCompany() {
//   const { id } = useParams();
//   const [company, setCompany] = useState(null);
//   const [movies, setMovies] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       const API_KEY = import.meta.env.VITE_API_KEY;

//       // company details
//       const res = await fetch(
//         `https://api.themoviedb.org/3/company/${id}?api_key=${API_KEY}`
//       );
//       const data = await res.json();
//       setCompany(data);

//       // ✅ FIXED API
//       const movieRes = await fetch(
//         `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_companies=${id}`
//       );
//       const movieData = await movieRes.json();
//       setMovies(movieData.results || []);
//     }

//     fetchData();
//   }, [id]);

//   if (!company) return <h2>Loading...</h2>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>{company.name}</h1>
//       <p>{company.origin_country}</p>

//       <h2>Produced Movies 🎬</h2>

//       <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
//         {movies.length > 0 ? (
//           movies.map((movie) => (
//             <div key={movie.id} style={{ width: "150px" }}>
//               {movie.poster_path && (
//                 <Link to={`/movie/${movie.id}`}>
//                   <img
//                     src={`${baseImageUrl}${movie.poster_path}`}
//                     alt={movie.title}
//                     style={{ width: "100%" }}
//                   />
//                 </Link>
//               )}
//               <p>{movie.title}</p>
//             </div>
//           ))
//         ) : (
//           <p>No Movies Found</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SingleCompany;