import MovieCard from "../MovieCard";
import { useAppSelector } from "../../utils/hooks";
import {
  selectWatchState,
  selectDroppedItems,
} from "../../utils/watch/watchSelectors";
import { selectTopRated } from "../../utils/movieSelector";
import type { Movie } from "../../utils/types";

const NextBestWatch = () => {
  const watchHistory = useAppSelector(selectWatchState);
  const dropped = useAppSelector(selectDroppedItems);
  const topRated = useAppSelector(selectTopRated);

  const watchedIds = new Set(watchHistory.map((w) => w.movieId));
  const droppedIds = new Set(dropped.map((d) => d.movieId));

  const next = (topRated as Movie[]).find(
    (m: Movie) => !watchedIds.has(m.id) && !droppedIds.has(m.id)
  );

  if (!next) return null;

  return (
    <section className="px-4 md:px-8 mb-10">
      <h2 className="text-xl font-semibold mb-2">Next Best Watch</h2>
      <p className="text-gray-400 text-sm mb-4">
        Selected based on your completion and drop-off patterns
      </p>

      <div className="flex items-start gap-6">
        <MovieCard movie={next} onHover={() => {}} onLeave={() => {}} />

        <div className="max-w-md">
          <p className="text-sm text-gray-300 mb-3">
            CineMind believes this title fits your taste profile and matches the
            type of content you usually complete.
          </p>

          <button className="bg-indigo-600 px-4 py-2 rounded-md font-semibold hover:bg-indigo-500">
            Add to Watchlist
          </button>
        </div>
      </div>
    </section>
  );
};

export default NextBestWatch;
