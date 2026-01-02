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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex justify-center items-start pt-16">
      <div className="relative bg-[#0B0F14] w-full md:w-3/4 lg:w-1/2 h-[85vh] rounded-xl p-6 flex flex-col border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-white text-xl font-semibold mb-1">Ask CineMind</h2>
        <p className="text-gray-400 text-sm mb-4">
          Describe a mood, genre, theme, or what you feel like watching.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 bg-[#111827] text-white p-3 rounded-md outline-none border border-white/10 focus:border-indigo-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. slow-burn thrillers with smart plots"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 px-5 rounded-md text-white font-semibold hover:bg-indigo-500 transition"
          >
            Search
          </button>
        </div>

        {status === "loading" && (
          <p className="text-gray-300 text-sm">Analyzing preferences…</p>
        )}
        {status === "failed" && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex-1 overflow-y-auto mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.map((movie) => {
              const explanation = explanations[movie.id];

              return (
                <div key={movie.id} className="space-y-1">
                  <MovieCard
                    movie={movie}
                    onHover={() => {}}
                    onLeave={() => {}}
                  />

                  <button
                    className="text-xs text-indigo-400 hover:underline"
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
                    Why did CineMind suggest this?
                  </button>

                  {explanation && (
                    <p className="text-xs text-gray-300 leading-snug">
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
