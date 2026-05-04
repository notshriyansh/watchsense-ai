import { useMemo, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { addToMyList, removeFromMyList } from "../../utils/myListSlice";
import { selectWatchState } from "../../utils/watch/watchSelectors";
import { selectMovies, selectIsInMyList } from "../../utils/movieSelector";
import { getTopRecommendations } from "../../utils/recommendationEngine";
import type { RankedMovie } from "../../utils/recommendationEngine";
import { addToRecommendationHistory } from "../../utils/recommendationHistory";
import { fetchExplainRecommendation } from "../../utils/watch/explainSlice";
import MovieCard from "../MovieCard";

const buildQuickBadge = (matchFeatures: string[]): string => {
  if (matchFeatures.length === 0) return "Matches your recent activity";
  const top = matchFeatures.slice(0, 2).join(" & ");
  return `Because you like ${top}`;
};

interface RecommendationCardProps {
  movie: RankedMovie;
}

const RecommendationCard = ({ movie }: RecommendationCardProps) => {
  const dispatch = useAppDispatch();
  const watchHistory = useAppSelector(selectWatchState);
  const isInWatchlist = useAppSelector(selectIsInMyList(movie.id));

  const [showExplanation, setShowExplanation] = useState(false);

  const explanation = useAppSelector(
    (state) => state.explain.explanations[movie.id] ?? null,
  );
  const isLoadingExplanation = useAppSelector(
    (state) => state.explain.loadingIds[movie.id] ?? false,
  );

  const handleToggleExplanation = () => {
    if (!showExplanation && explanation === null) {
      dispatch(
        fetchExplainRecommendation({
          movieId: movie.id,
          title: movie.title,
          overview: movie.overview,
          genreIds: movie.genre_ids,
          watchHistory,
        }),
      );
    }
    setShowExplanation((prev) => !prev);
  };

  const quickBadge = buildQuickBadge(movie.matchFeatures);

  return (
    <div className="flex flex-col w-full">
      <div className="h-5 mb-1">
        <span className="text-xs text-indigo-400 truncate block">
          {quickBadge}
        </span>
      </div>

      <div className="w-full">
        <MovieCard movie={movie} />
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={() =>
            isInWatchlist
              ? dispatch(removeFromMyList(movie.id))
              : dispatch(addToMyList({ movie, contentType: "movie" }))
          }
          className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
            isInWatchlist
              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }`}
        >
          {isInWatchlist ? "Saved" : "Add"}
        </button>

        <button
          onClick={handleToggleExplanation}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
        >
          {showExplanation ? "Hide" : "Why this?"}
        </button>
      </div>

      {showExplanation && (
        <div className="mt-2 bg-neutral-900 border border-white/10 rounded-md p-3 text-sm text-gray-300">
          {isLoadingExplanation ? (
            <span className="text-gray-500 italic">Analyzing...</span>
          ) : explanation ? (
            <p className="leading-relaxed">{explanation}</p>
          ) : (
            <span className="text-gray-500 italic">
              No explanation available.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const NextBestWatch = () => {
  const watchHistory = useAppSelector(selectWatchState);
  const { topRated, popular, nowPlaying } = useAppSelector(selectMovies);

  const recommendations = useMemo(() => {
    const map = new Map();
    [...topRated, ...popular, ...nowPlaying].forEach((m) => {
      if (!map.has(m.id)) map.set(m.id, m);
    });
    return getTopRecommendations(Array.from(map.values()), watchHistory, 5);
  }, [topRated, popular, nowPlaying, watchHistory]);

  useEffect(() => {
    recommendations.forEach((rec) => addToRecommendationHistory(rec.id));
  }, [recommendations]);

  if (recommendations.length === 0) return null;

  return (
    <section className="px-4 sm:px-8 mb-10">
      <h2 className="text-xl font-semibold mb-1">Recommended for You</h2>
      <p className="text-sm text-gray-400 mb-4">
        Personalized picks based on your watch history, balancing similarity,
        recency, and discovery
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {recommendations.map((movie) => (
          <RecommendationCard key={movie.id} movie={movie} />
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Recommendations adapt to your recent activity and avoid repetition
      </p>
    </section>
  );
};

export default NextBestWatch;
