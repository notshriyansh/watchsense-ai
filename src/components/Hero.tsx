import type { Movie } from "../utils/types";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { addToMyList, removeFromMyList } from "../utils/myListSlice";
import { selectIsInMyList } from "../utils/movieSelector";

interface Props {
  movie: Movie;
  reason?: string;
}

const Hero = ({ movie, reason }: Props) => {
  const dispatch = useAppDispatch();
  const isInWatchlist = useAppSelector(selectIsInMyList(movie.id));

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";

  return (
    <section className="relative w-full min-h-[80vh] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-screen"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F14] via-[#0B0F14]/90 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-transparent" />

      <div className="relative z-10 max-w-3xl px-6 sm:px-12 mt-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-xs font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider">
            Now Playing
          </span>
          <span className="text-xs text-[#8A93A3] tracking-widest uppercase font-medium">Selected For You</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-serif font-light text-[#E6EAF0] leading-[1.1] mb-6">
          {movie.title}
        </h1>

        <p className="text-[#8A93A3] text-lg mb-8 line-clamp-3 leading-relaxed max-w-2xl font-light">
          {movie.overview}
        </p>

        {reason && (
          <div className="bg-[#0E1622] border-l-2 border-cyan-500 p-5 rounded-r-md mb-8 max-w-xl shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wide">AI Recommendation Analysis</span>
            </div>
            <p className="text-sm text-[#E6EAF0] leading-relaxed">
              {reason}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " trailer")}`, '_blank')}
            className="bg-[#E6EAF0] hover:bg-white text-[#0B0F14] px-6 py-2.5 rounded font-medium transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Play Trailer
          </button>
          
          <button
            onClick={() =>
              isInWatchlist
                ? dispatch(removeFromMyList(movie.id))
                : dispatch(addToMyList({ movie, contentType: "movie" }))
            }
            className={`border px-6 py-2.5 rounded font-medium transition-colors flex items-center gap-2 ${
              isInWatchlist
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                : "border-white/20 bg-[#0E1622]/50 text-[#E6EAF0] hover:bg-white/10"
            }`}
          >
            {isInWatchlist ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Tracked
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Track Title
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
