const BASE_URL = "https://api.themoviedb.org/3/";
const API_KEY = import.meta.env.VITE_API_KEY;
export const baseImageUrl = "https://image.tmdb.org/t/p/original";
let year = 2026;
export const urls = {
  trendingByDay: `${BASE_URL}trending/movie/day?language=en-US&api_key=${API_KEY}`,
  trendingByWeek: `${BASE_URL}trending/movie/week?language=en-US&api_key=${API_KEY}`,
  popularMovies: `${BASE_URL}movie/popular?language=en-US&api_key=${API_KEY}`,
  popularTVShows: `${BASE_URL}tv/popular?language=en-US&api_key=${API_KEY}`,
  topRatedMovies: `${BASE_URL}movie/top_rated?language=en-US&api_key=${API_KEY}`,
  topRatedTVShows: `${BASE_URL}tv/top_rated?language=en-US&api_key=${API_KEY}`,
  upcomingMovies: `${BASE_URL}discover/movie?api_key=${API_KEY}
&primary_release_date.gte=${year}-04-01
&primary_release_date.lte=${year}-12-31
&sort_by=popularity.desc`,
  upcomingTVShows: `${BASE_URL}discover/tv?first_air_date.gte=2026-05-30&sort_by=first_air_date.lte=2028-01-01&api_key=${API_KEY}`,
  popularCast:`${BASE_URL}person/popular?api_key=${API_KEY}`,
};
