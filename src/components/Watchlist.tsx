import { useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import { selectMyList, selectWatch } from "../utils/movieSelector";
import { removeFromMyList } from "../utils/myListSlice";
import MovieCard from "./MovieCard";

type SortOption = "recent" | "oldest" | "never-watched";
type FilterOption = "all" | "movie" | "tv";

const daysAgo = (timestamp: number) =>
  Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));

const Watchlist = () => {
  const dispatch = useAppDispatch();
  const list = useAppSelector(selectMyList);
  const watchHistory = useAppSelector(selectWatch);

  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  const processedList = useMemo(() => {
    let items = [...list];

    if (filterBy !== "all") {
      items = items.filter((item) => item.contentType === filterBy);
    }

    if (sortBy === "recent") {
      items.sort((a, b) => b.addedAt - a.addedAt);
    }

    if (sortBy === "oldest") {
      items.sort((a, b) => a.addedAt - b.addedAt);
    }

    if (sortBy === "never-watched") {
      items = items.filter(
        (item) =>
          !watchHistory.some(
            (w) => w.movieId === item.movie.id && w.progressPercent > 0
          )
      );
    }

    return items;
  }, [list, watchHistory, sortBy, filterBy]);

  if (!list.length) {
    return <p className="text-gray-400 px-6 mt-24">Your watchlist is empty.</p>;
  }

  return (
    <section className="px-4 sm:px-8 mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">My Watchlist</h2>

        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-[#111827] border border-white/10 text-sm rounded px-3 py-1.5"
          >
            <option value="recent">Recently Added</option>
            <option value="oldest">Oldest Added</option>
            <option value="never-watched">Never Watched</option>
          </select>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="bg-[#111827] border border-white/10 text-sm rounded px-3 py-1.5"
          >
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Series</option>
          </select>
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6
          gap-4
        "
      >
        {processedList.map((item) => (
          <div
            key={item.movie.id}
            className="transition-transform hover:scale-[1.03]"
          >
            <MovieCard movie={item.movie} contentType={item.contentType} />

            <p className="text-[11px] text-gray-400 mt-1 text-center">
              Added {daysAgo(item.addedAt)} days ago
            </p>

            <button
              onClick={() => dispatch(removeFromMyList(item.movie.id))}
              className="block mx-auto mt-1 text-xs text-red-400 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Watchlist;
