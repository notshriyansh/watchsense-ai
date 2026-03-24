import MovieCard from "../MovieCard";
import { useAppSelector } from "../../utils/hooks";
import {
  selectContinueWatching,
  selectInProgressOnly,
} from "../../utils/watch/watchSelectors";

const ContinueWatchingRow = () => {
  const inProgress = useAppSelector(selectInProgressOnly);
  const continueWatching = useAppSelector(selectContinueWatching);

  const items = continueWatching.filter((item) =>
    inProgress.some((i) => i.movieId === item.movieId)
  );

  if (items.length === 0) return null;

  return (
    <section className="px-4 md:px-8 mb-8">
      <h2 className="text-white text-lg md:text-xl mb-1 font-semibold">
        In Progress
      </h2>
      <p className="text-gray-400 text-sm mb-3">
        Titles you are actively engaging with
      </p>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
        {items.map((item) => (
          <div
            key={item.movieId}
            className="relative w-[40vw] sm:w-40 md:w-44 shrink-0 snap-start"
          >
            <MovieCard
              movie={
                {
                  id: item.movieId,
                  title: item.title,
                  poster_path: item.posterPath,
                } as any
              }
            />

            <div className="mt-2 h-1 rounded bg-gray-700 overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>

            <p className="text-[11px] sm:text-xs text-gray-400 mt-1 text-center">
              {item.progressPercent}% completed
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContinueWatchingRow;
