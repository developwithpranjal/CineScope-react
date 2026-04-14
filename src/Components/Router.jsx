import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../Pages/Home";
import SingleMovie from "../Pages/SingleMovie";
import Header from "./Header";
import Footer from "./Footer";
import { urls } from "../data";
import WatchList from "../Pages/WatchList";
import Login from "../Pages/Login";
import { createContext, useState, useEffect } from "react";
import SinglePerson from "../Pages/SinglePerson";
import PageNotFound from "../Pages/PageNotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import ScrollToTop from "./ScrollToTop";
import GenrePage from "../Pages/GenrePage";
import Profile from "../Pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import OnboardingPopup from "./OnboardingPopup";

import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

export const MovieContext = createContext(null);

function Router() {
  const [Watchlist, setWatchList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false)
    });
    return () => unsub();
  }, []);
  useEffect(() => {
    if (!user) {
      setWatchList([]);
      return;
    }

    const colRef = collection(db, "watchlists", user.uid, "movies-shows");
    const unsub = onSnapshot(colRef, (snapshot) => {
      const movies = snapshot.docs.map((doc) => doc.data());
      setWatchList(movies);
    });

    return () => unsub();
  }, [user]);
  async function AddToWatchlist(MovieToAdd) {
    const docId = `${MovieToAdd.media_type || (MovieToAdd.first_air_date ? "tv" : "movie")}_${MovieToAdd.id}`;
    const docRef = doc(db, "watchlists", user.uid, "movies-shows", docId);
    await setDoc(docRef, MovieToAdd);
  }
  async function RemoveFromWatchList(IdToRemove) {
    const found = Watchlist.find((item) => item.id === IdToRemove);
    const docId = `${found.media_type || (found.first_air_date ? "tv" : "movie")}_${IdToRemove}`;
    const docRef = doc(db, "watchlists", user.uid, "movies-shows", docId);
    await deleteDoc(docRef);
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
  useEffect(() => {
    if (user && location.state?.pendingMovie) {
      AddToWatchlist(location.state.pendingMovie);
    }
  }, [user]);
  return (
    <MovieContext.Provider
      value={{
        Watchlist,
        setWatchList,
        AddToWatchlist,
        RemoveFromWatchList,
        isInwatchlist,
        handleLogout,
        user,
        loading,
      }}
    >
      <Header />
      <OnboardingPopup/>
      <ScrollToTop />

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
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <WatchList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/person/:id" element={<SinglePerson />} />
        <Route path="/genre/:id" element={<GenrePage />} />
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
  );
}

export default Router;
