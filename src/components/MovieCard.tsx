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
        relative
        w-32 sm:w-36 md:w-44
        shrink-0
        cursor-pointer
        transition-transform
        md:hover:scale-110
      "
    >
      <img src={posterUrl} alt={movie.title} className="rounded-md w-full" />

      <div
        className="
        hidden md:flex
        absolute inset-0
        bg-black/70
        opacity-0 hover:opacity-100
        transition-opacity
        rounded-md
        flex-col justify-end
        p-3
      "
      >
        <h3 className="text-white text-sm font-semibold">{movie.title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;
