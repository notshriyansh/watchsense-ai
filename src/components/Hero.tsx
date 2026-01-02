import type { Movie } from "../utils/types";

interface Props {
  movie: Movie;
  reason?: string;
}

const Hero = ({ movie, reason }: Props) => {
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";

  return (
    <section className="relative w-full h-[65vh] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#0B0F14] via-[#0B0F14]/85 to-transparent" />

      <div className="relative z-10 max-w-2xl px-6 md:px-12 pt-32">
        <span className="text-xs uppercase tracking-widest text-indigo-400">
          CineMind Highlight
        </span>

        <h1 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
          {movie.title}
        </h1>

        <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-4">
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

        <div className="flex gap-3">
          <button className="bg-indigo-600 px-6 py-2 rounded-md font-semibold hover:bg-indigo-500">
            Add to Watchlist
          </button>
          <button className="bg-white/10 px-6 py-2 rounded-md font-semibold hover:bg-white/20">
            View Details
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
