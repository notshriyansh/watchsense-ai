import { useAppSelector } from "../../utils/hooks";
import { selectStaleWatchlist } from "../../utils/movieSelector";
import MovieCard from "../MovieCard";

const daysAgo = (timestamp: number) =>
  Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));

const StaleWatchlistReminder = () => {
  const staleItems = useAppSelector(selectStaleWatchlist);

  if (!staleItems.length) return null;

  return (
    <section className="px-4 sm:px-8 mb-10">
      <h2 className="text-lg sm:text-xl font-semibold mb-1 text-indigo-400">
        Still On Your List
      </h2>

      <p className="text-xs sm:text-sm text-gray-400 mb-4">
        You added these but haven’t started them yet
      </p>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {staleItems.map(({ movie, addedAt }) => (
          <div key={movie.id} className="shrink-0">
            <MovieCard movie={movie} />

            <p className="text-[11px] text-gray-400 mt-1 text-center">
              Added {daysAgo(addedAt)} days ago
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StaleWatchlistReminder;
