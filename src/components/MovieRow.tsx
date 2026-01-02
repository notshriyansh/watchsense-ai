import type { Movie } from "../utils/types";
import MovieCard from "./MovieCard";

const MovieRow = ({ title, movies }: { title: string; movies: Movie[] }) => {
  return (
    <section className="px-4 md:px-8 mb-6">
      <h2 className="text-white text-lg md:text-xl mb-3 font-semibold">
        {title}
      </h2>

      <div className="flex gap-3 md:gap-4 overflow-x-scroll scrollbar-hide pb-2">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onHover={() => {}}
            onLeave={() => {}}
          />
        ))}
      </div>
    </section>
  );
};

export default MovieRow;
