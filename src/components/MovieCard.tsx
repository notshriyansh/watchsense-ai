import type { BaseMovie } from "../utils/types";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { addToMyList, removeFromMyList } from "../utils/myListSlice";
import { selectIsInMyList } from "../utils/movieSelector";

interface Props {
  movie: BaseMovie;
  onHover?: () => void;
  onLeave?: () => void;
}

const MovieCard = ({ movie, onHover, onLeave }: Props) => {
  const dispatch = useAppDispatch();
  const isInWatchlist = useAppSelector(selectIsInMyList(movie.id));

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-poster.png";

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="
        group relative w-36 md:w-44 shrink-0
        rounded-lg overflow-hidden
        bg-[#111827]
        border border-white/10
        hover:border-indigo-500/40
        transition
      "
    >
      <img
        src={posterUrl}
        alt={movie.title}
        className="w-full h-56 object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />

      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition">
        <h3 className="text-white text-sm font-semibold line-clamp-2">
          {movie.title}
        </h3>

        <button
          onClick={(e) => {
            e.stopPropagation();
            isInWatchlist
              ? dispatch(removeFromMyList(movie.id))
              : dispatch(addToMyList(movie));
          }}
          className={`
            mt-2 w-full text-xs font-semibold rounded py-1.5
            ${
              isInWatchlist
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-indigo-600 hover:bg-indigo-500"
            }
          `}
        >
          {isInWatchlist ? "In Watchlist ✓" : "Add to Watchlist"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
