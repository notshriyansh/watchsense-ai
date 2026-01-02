import type { Movie } from "../utils/types";

interface Props {
  movie: Movie;
  trailerKey: string;
}

const Hero = ({ movie, trailerKey }: Props) => {
  return (
    <section className="relative w-full aspect-video text-white mt-16 md:mt-0">
      <iframe
        className="absolute inset-0 w-full h-full pointer-events-none"
        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1`}
        allow="autoplay"
      />

      <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />

      <div className="relative z-10 max-w-xl px-4 md:px-12 pt-[35%] md:pt-[20%]">
        <h1 className="text-2xl md:text-5xl font-bold mb-3">{movie.title}</h1>

        <p className="hidden md:block text-sm text-gray-200 mb-6 line-clamp-3">
          {movie.overview}
        </p>

        <div className="flex gap-3">
          <button className="bg-white text-black px-4 md:px-6 py-2 rounded font-semibold hover:bg-gray-200">
            ▶ Play
          </button>

          <button className="bg-gray-600/70 px-4 md:px-6 py-2 rounded font-semibold hover:bg-gray-500">
            ℹ More Info
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
