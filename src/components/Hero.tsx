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
    <section className="relative w-full min-h-svh sm:min-h-[65vh] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#0B0F14] via-[#0B0F14]/85 to-transparent" />

      <div className="relative z-10 max-w-2xl px-4 sm:px-12 pt-24 sm:pt-32 pb-10">
        <span className="text-xs uppercase tracking-widest text-indigo-400">
          CineMind Highlight
        </span>

        <h1 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">
          {movie.title}
        </h1>

        <p className="text-gray-300 text-sm sm:text-base mb-6 line-clamp-4">
          {movie.overview}
        </p>

        {reason && (
          <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-indigo-200">
              <span className="font-semibold text-indigo-400">
                Why this is highlighted:
              </span>{" "}
              {reason}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 max-w-sm">
          <button
            onClick={() =>
              isInWatchlist
                ? dispatch(removeFromMyList(movie.id))
                : dispatch(
                    addToMyList({
                      movie,
                      contentType: "movie",
                    })
                  )
            }
            className={`px-4 py-3 rounded-md font-semibold text-sm transition ${
              isInWatchlist
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {isInWatchlist ? "In Watchlist ✓" : "Add to Watchlist"}
          </button>

          <button className="bg-white/10 px-4 py-3 rounded-md font-semibold text-sm hover:bg-white/20">
            View Details
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
