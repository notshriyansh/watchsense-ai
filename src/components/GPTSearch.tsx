import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { fetchGPTMovies, clearGPTMovies } from "../utils/gptSlice";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const { results, status, error } = useAppSelector((s) => s.gpt);
  const watchHistory = useAppSelector(selectWatchState);

  const explanations = useAppSelector(
    (state: RootState) => state.explain.explanations
  );

  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      dispatch(clearGPTMovies());
    };
  }, [dispatch]);

  const handleSearch = () => {
    if (!query.trim() || status === "loading") return;
    dispatch(fetchGPTMovies(query));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">

      <div className="w-full md:w-[600px] lg:w-[800px] h-full bg-[#0B0F14]/95 backdrop-blur-xl border-l border-white/5 flex flex-col shadow-2xl animate-slide-left p-6 sm:p-10 relative overflow-hidden">


        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h2 className="text-cyan-500 text-xs font-mono uppercase tracking-widest">Global Watch Network</h2>
            </div>
            <h1 className="text-3xl font-serif text-[#E6EAF0]">Ask CineMind AI</h1>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-[#0E1622] hover:bg-white/10 text-[#8A93A3] hover:text-[#E6EAF0] transition-colors border border-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative mb-8">
          <input
            ref={inputRef}
            className="w-full bg-[#0E1622] text-[#E6EAF0] text-lg p-5 pl-5 pr-14 rounded-xl outline-none border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-light placeholder-[#8A93A3]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., Slow-burn thrillers set in space..."
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-[#0B0F14] rounded-lg flex items-center justify-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {status === "loading" && (
          <div className="flex items-center gap-3 text-cyan-500 font-medium py-4 px-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <p className="text-sm font-mono tracking-wide">Processing query parameters...</p>
          </div>
        )}

        {status === "failed" && (
          <div className="bg-red-500/10 border-l-2 border-red-500 p-4 rounded-r mt-2">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-8 mt-2 pb-10">
          {results.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {results.map((movie) => {
                const explanation = explanations[movie.id];
                const hasExplanation = !!explanation;

                return (
                  <div key={movie.id} className="flex flex-col">
                    <div className="w-full shrink-0 flex justify-center mb-3">
                      <MovieCard movie={movie} />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="mb-3">
                        <OTTProviders movieId={movie.id} />
                      </div>

                      {hasExplanation ? (
                        <div className="mt-auto bg-cyan-500/5 border-l-2 border-cyan-500 p-3 rounded-r-md">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">AI Insight</span>
                          </div>
                          <p className="text-xs text-[#E6EAF0] leading-relaxed">
                            {explanation}
                          </p>
                        </div>
                      ) : (
                        <button
                          className="mt-auto text-xs text-[#8A93A3] hover:text-[#E6EAF0] transition-colors flex items-center gap-1 group py-1 border-b border-transparent hover:border-white/20 self-start"
                          onClick={() => {
                            dispatch(
                              fetchExplainRecommendation({
                                movieId: movie.id,
                                title: movie.title,
                                overview: movie.overview || "",
                                watchHistory,
                              })
                            );
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Explain Recommendation
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GPTSearch;
