import MovieCard from "../MovieCard";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { selectDroppedItems } from "../../utils/watch/watchSelectors";
import { fetchDropOffInsight } from "../../utils/watch/insightsSlice";
import type { RootState } from "../../utils/appStore";

const DropOffRow = () => {
  const dispatch = useAppDispatch();
  const droppedItems = useAppSelector(selectDroppedItems);
  const insights = useAppSelector(
    (state: RootState) => state.insights.dropOffInsights
  );

  if (droppedItems.length === 0) return null;

  return (
    <section className="px-4 md:px-8 mb-10">
      <h2 className="text-white text-lg md:text-xl mb-1 font-semibold">
        Drop-off Analysis
      </h2>
      <p className="text-gray-400 text-sm mb-4">
        Titles you disengaged from — analyzed by AI
      </p>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
        {droppedItems.map((item) => {
          const insight = insights[item.movieId];

          return (
            <div key={item.movieId} className="w-44 shrink-0">
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

              <button
                className="mt-2 text-xs text-indigo-400 hover:underline"
                onClick={() =>
                  dispatch(
                    fetchDropOffInsight({
                      item,
                      overview: "Movie overview from TMDB",
                    })
                  )
                }
              >
                Analyze drop-off
              </button>

              {insight && (
                <div className="mt-2 space-y-1">
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded font-semibold ${
                      insight.verdict === "CONTINUE"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {insight.verdict === "CONTINUE"
                      ? "Worth continuing"
                      : "Safe to drop"}
                  </span>

                  <p className="text-xs text-gray-300 leading-snug">
                    {insight.reason}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DropOffRow;
