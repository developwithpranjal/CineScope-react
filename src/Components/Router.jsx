import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import SingleMovie from "../Pages/SingleMovie";
import Header from "./Header";
import Footer from "./Footer";
import { urls } from "../data";
import WatchList from "../Pages/WatchList";
import Login from "../Pages/Login";
import { createContext, useState } from "react";
import SinglePerson from "../Pages/SinglePerson";
// import App from "../Pages/App";

export const MovieContext = createContext(null);

function Router() {
  const [Watchlist, setWatchList] = useState([]);

  function AddToWatchlist(movieToAdd) {
    const exists = Watchlist.find((item) => item.id === movieToAdd.id);
    if (!exists) {
      setWatchList([...Watchlist, movieToAdd]);
    }
  }
  function RemoveFromWatchList(MovieToRemove) {
    console.log(MovieToRemove);
    setWatchList(
      Watchlist.filter((item) => {
        return item.id !== MovieToRemove;
      }),
    );
  }
  function isInwatchlist(id) {
    return Watchlist.some((item) => item.id === id);
  }
  return (
    <BrowserRouter>
      <MovieContext.Provider
        value={{ Watchlist, setWatchList, AddToWatchlist, RemoveFromWatchList,isInwatchlist }}
      >
        <Header />

        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Home
                  heading="Trending Movies"
                  btn1="Day"
                  btn2="Week"
                  urls={[urls.trendingByDay, urls.trendingByWeek]}
                />

                <Home
                  heading="Popular Movies"
                  btn1="Movies"
                  btn2="TV Shows"
                  urls={[urls.popularMovies, urls.popularTVShows]}
                />
                <Home
                  heading="Popular Cast"
                  btn1="Movies"
                  btn2="TV Shows"
                  urls={[urls.popularCast,urls.popularCast]}
                />

                <Home
                  heading="Top Rated Movies"
                  btn1="Movies"
                  btn2="TV Shows"
                  urls={[urls.topRatedMovies, urls.topRatedTVShows]}
                />
                <Home
                  heading="UpComing Movies"
                  btn1="Movies"
                  btn2="TV Shows"
                  urls={[urls.upcomingMovies, urls.upcomingTVShows]}
                />
              </div>
            }
          />

          <Route path="/movie/:id" element={<SingleMovie />} />
          <Route path="/tv/:id" element={<SingleMovie />} />
          <Route path="/watchlist" element={<WatchList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/person/:id" element={<SinglePerson />} />
        </Routes>

        <Footer />
      </MovieContext.Provider>
    </BrowserRouter>
  );
}

export default Router;
