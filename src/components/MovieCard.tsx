import type { BaseMovie } from "../utils/types";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { addToMyList, removeFromMyList } from "../utils/myListSlice";
import { selectIsInMyList } from "../utils/movieSelector";

interface Props {
  movie: BaseMovie;
  contentType?: "movie" | "tv";
}

const MovieCard = ({ movie, contentType = "movie" }: Props) => {
  const dispatch = useAppDispatch();
  const isInWatchlist = useAppSelector(selectIsInMyList(movie.id));

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-poster.png";

  return (
    <div
      className="group relative w-40 md:w-48 shrink-0 rounded object-cover cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-900/20"
    >
      <div className="aspect-[2/3] w-full rounded overflow-hidden bg-[#0E1622] border border-transparent group-hover:border-cyan-500/30 transition-colors">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded flex flex-col justify-end p-4">
        <h3 className="text-[#E6EAF0] font-medium text-sm line-clamp-2 leading-snug mb-3 drop-shadow-md">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " trailer")}`, '_blank');
            }}
            className="h-8 w-8 rounded-full bg-[#E6EAF0] text-[#0B0F14] flex items-center justify-center hover:bg-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              isInWatchlist
                ? dispatch(removeFromMyList(movie.id))
                : dispatch(addToMyList({ movie, contentType }));
            }}
            className="h-8 w-8 rounded-full border border-white/20 bg-[#0E1622]/50 text-[#E6EAF0] flex items-center justify-center hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
          >
            {isInWatchlist ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
