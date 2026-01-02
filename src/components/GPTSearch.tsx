import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { fetchGPTMovies } from "../utils/gptSlice";
import MovieCard from "./MovieCard";
import { fetchExplainRecommendation } from "../utils/watch/explainSlice";
import { selectWatchState } from "../utils/watch/watchSelectors";
import type { RootState } from "../utils/appStore";
import OTTProviders from "./OTTProviders";

interface GPTSearchProps {
  onClose: () => void;
}

const GPTSearch = ({ onClose }: GPTSearchProps) => {
  const [query, setQuery] = useState("");

  const dispatch = useAppDispatch();

  const { results, status, error } = useAppSelector((s) => s.gpt);

  const watchHistory = useAppSelector(selectWatchState);

  const explanations = useAppSelector(
    (state: RootState) => state.explain.explanations
  );

  const handleSearch = () => {
    if (!query.trim() || status === "loading") return;
    dispatch(fetchGPTMovies(query));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-start pt-16">
      <div className="bg-neutral-900 w-full md:w-3/4 lg:w-1/2 h-[85vh] rounded-xl p-6 flex flex-col">
        <button
          onClick={onClose}
          className="text-white text-xl absolute top-3 right-4"
        >
          ✕
        </button>

        <h2 className="text-white text-lg md:text-xl mb-4">GPT Movie Search</h2>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 bg-gray-800 text-white p-2 rounded"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask for movies, genres, moods..."
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-red-600 px-4 rounded text-white"
          >
            Search
          </button>
        </div>

        {status === "loading" && <p className="text-white">Searching…</p>}
        {status === "failed" && <p className="text-red-500">{error}</p>}

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.map((movie) => {
              const explanation = explanations[movie.id];

              return (
                <div key={movie.id}>
                  <MovieCard
                    movie={movie}
                    onHover={() => {}}
                    onLeave={() => {}}
                  />

                  <button
                    className="text-xs text-gray-400 mt-1 hover:underline"
                    onClick={() => {
                      if (!explanations[movie.id]) {
                        dispatch(
                          fetchExplainRecommendation({
                            movieId: movie.id,
                            title: movie.title,
                            overview: movie.overview || "",
                            watchHistory,
                          })
                        );
                      }
                    }}
                  >
                    Why am I seeing this?
                  </button>

                  {explanation && (
                    <p className="text-xs text-gray-300 mt-1 leading-snug">
                      {explanation}
                    </p>
                  )}

                  <OTTProviders movieId={movie.id} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPTSearch;
