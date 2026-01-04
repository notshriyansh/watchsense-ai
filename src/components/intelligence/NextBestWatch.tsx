import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { addToMyList, removeFromMyList } from "../../utils/myListSlice";
import {
  selectWatchState,
  selectDroppedItems,
} from "../../utils/watch/watchSelectors";
import { selectTopRated, selectIsInMyList } from "../../utils/movieSelector";
import MovieCard from "../MovieCard";
import type { Movie } from "../../utils/types";

const NextBestWatch = () => {
  const dispatch = useAppDispatch();

  const watchHistory = useAppSelector(selectWatchState);
  const dropped = useAppSelector(selectDroppedItems);
  const topRated = useAppSelector(selectTopRated);

  const watchedIds = new Set(watchHistory.map((w) => w.movieId));
  const droppedIds = new Set(dropped.map((d) => d.movieId));

  const next = topRated.find(
    (m: Movie) => !watchedIds.has(m.id) && !droppedIds.has(m.id)
  );

  const isInWatchlist = useAppSelector(
    next ? selectIsInMyList(next.id) : () => false
  );

  if (!next) return null;

  return (
    <section className="px-4 sm:px-8 mb-10">
      <h2 className="text-xl font-semibold mb-2">Next Best Watch</h2>
      <p className="text-gray-400 text-sm mb-4">
        Recommended based on your completion behavior
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <MovieCard movie={next} />

        <div className="max-w-md">
          <p className="text-sm text-gray-300 mb-3">
            CineMind believes this matches your taste profile.
          </p>

          <button
            onClick={() =>
              isInWatchlist
                ? dispatch(removeFromMyList(next.id))
                : dispatch(
                    addToMyList({
                      movie: next,
                      contentType: "movie",
                    })
                  )
            }
            className={`px-4 py-2 rounded-md font-semibold transition ${
              isInWatchlist
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {isInWatchlist ? "Saved" : "Add to Watchlist"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default NextBestWatch;
