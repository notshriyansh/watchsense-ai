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
      <h2 className="text-xl font-semibold mb-6">My Watchlist</h2>

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
        {list.map((item) => (
          <div key={item.movie.id}>
            <MovieCard movie={item.movie} />

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
