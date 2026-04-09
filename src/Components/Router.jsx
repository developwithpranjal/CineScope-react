import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import SingleMovie from "../Pages/SingleMovie";
import Header from "./Header";
import Footer from "./Footer";
import { urls } from "../data";
import WatchList from "../Pages/WatchList";
import Login from "../Pages/Login";
import { createContext, useState,useEffect } from "react";
import SinglePerson from "../Pages/SinglePerson";
import PageNotFound from "../Pages/PageNotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import ScrollToTop from "./ScrollToTop";
import GenrePage from "../Pages/Genrepage";
import Profile from "../Pages/Profile";

// import SingleCompany from "../Pages/SingleCompany";
// import App from "../Pages/App";

export const MovieContext = createContext(null);

function Router() {
  const [Watchlist, setWatchList] = useState([]);
  const [user, setUser] = useState(null);

useEffect(() => {
  const unsub = onAuthStateChanged(auth, (u) => {
    setUser(u);
  });
  return () => unsub();
}, []);

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
  function handleLogout() {
    signOut(auth)
      .then(() => {
        alert("Logged out ✅");
      })
      .catch((error) => {
        alert(error.message);
      });
  }
  return (
    <BrowserRouter>
      <MovieContext.Provider
        value={{
          Watchlist,
          setWatchList,
          AddToWatchlist,
          RemoveFromWatchList,
          isInwatchlist,
          handleLogout,
          user,
        }}
      >
        <Header />
        <ScrollToTop/>

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
                  btn2="TV Shows "
                  urls={[urls.popularCast, urls.popularCast]}
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
          <Route path="/genre/:id" element={<GenrePage />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>

        <Footer />
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          theme="dark"
          newestOnTop
          closeOnClick
          pauseOnHover={false}
        />
      </MovieContext.Provider>
    </BrowserRouter>
  );
}

export default Router;
