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
    <section className="px-4 md:px-8 mb-6">
      <h2 className="text-white text-lg md:text-xl mb-3 font-semibold">
        Continue Watching
      </h2>

      <div className="flex gap-3 md:gap-4 overflow-x-scroll scrollbar-hide pb-2">
        {items.map((item) => (
          <div key={item.movieId} className="relative">
            <MovieCard
              movie={
                {
                  id: item.movieId,
                  title: item.title,
                  poster_path: item.posterPath,
                } as any
              }
              onHover={() => {}}
              onLeave={() => {}}
            />

            <div className="absolute left-0 right-0 bottom-0 h-1 bg-gray-700">
              <div
                className="h-full bg-red-600"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContinueWatchingRow;
