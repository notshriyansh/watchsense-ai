import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import {
  fetchNowPlayingMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchMovieTrailerById,
} from "../utils/movieSlice";
import MovieRow from "./MovieRow";
import Hero from "./Hero";
import ContinueWatchingRow from "./intelligence/ContinueWatchingRow";
import DropOffRow from "./intelligence/DropOffRow";
import NextBestWatch from "./intelligence/NextBestWatch";
import StaleWatchlistReminder from "./intelligence/StaleWatchlistReminder";

const Browse = () => {
  const dispatch = useAppDispatch();
  const { nowPlaying, topRated, popular } = useAppSelector(
    (store) => store.movies
  );

  useEffect(() => {
    dispatch(fetchNowPlayingMovies());
    dispatch(fetchTopRatedMovies());
    dispatch(fetchPopularMovies());
  }, [dispatch]);

  useEffect(() => {
    if (nowPlaying.length > 0) {
      dispatch(fetchMovieTrailerById(nowPlaying[0].id));
    }
  }, [dispatch, nowPlaying]);

  const heroReason =
    "You tend to complete slow-burn thrillers and highly rated dramas. This aligns with your viewing behavior.";

  return (
    <div className="min-h-svh bg-black">
      {nowPlaying.length > 0 && (
        <Hero movie={nowPlaying[0]} reason={heroReason} />
      )}

      <StaleWatchlistReminder />

      <NextBestWatch />

      <ContinueWatchingRow />
      <DropOffRow />

      <MovieRow title="Now Playing" movies={nowPlaying} />
      <MovieRow title="Top Rated" movies={topRated} />
      <MovieRow title="Popular" movies={popular} />
    </div>
  );
};

export default Browse;
