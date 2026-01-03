import { useAppSelector, useAppDispatch } from "../utils/hooks";
import { selectMyList } from "../utils/movieSelector";
import { removeFromMyList } from "../utils/myListSlice";
import MovieCard from "./MovieCard";

const daysAgo = (timestamp: number) =>
  Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));

const Watchlist = () => {
  const dispatch = useAppDispatch();
  const list = useAppSelector(selectMyList);

  if (!list.length) {
    return <p className="text-gray-400 px-6 mt-24">Your watchlist is empty.</p>;
  }

  return (
    <section className="px-4 sm:px-8 mt-24">
      <h2 className="text-xl font-semibold mb-4">My Watchlist</h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {list.map((item) => (
          <div key={item.movie.id} className="shrink-0">
            <MovieCard
              movie={item.movie}
              onHover={() => {}}
              onLeave={() => {}}
            />

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
