import type { Movie, GPTMovie } from "../utils/types";

type CardMovie = Movie | GPTMovie;

interface Props {
  movie: CardMovie;
  onHover: () => void;
  onLeave: () => void;
}

const MovieCard = ({ movie, onHover, onLeave }: Props) => {
  const posterUrl =
    "poster_path" in movie && movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/no-poster.png";

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="
        group
        relative
        w-36 md:w-44
        shrink-0
        rounded-lg
        overflow-hidden
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

      <div className="absolute bottom-0 p-3 opacity-0 group-hover:opacity-100 transition">
        <h3 className="text-white text-sm font-semibold leading-tight line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">Tap for insights</p>
      </div>
    </div>
  );
};

export default MovieCard;
