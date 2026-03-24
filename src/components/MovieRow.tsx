import type { Movie } from "../utils/types";
import MovieCard from "./MovieCard";

const MovieRow = ({ title, movies }: { title: string; movies: Movie[] }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="px-6 md:px-12 mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#E6EAF0] font-serif text-2xl font-light tracking-tight relative pl-4 border-l-2 border-cyan-500/50">
          {title}
        </h2>
        <div className="hidden sm:flex gap-2">
          <button className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-[#E6EAF0] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-[#E6EAF0] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-6 pt-2 snap-x">
        {movies.map((movie) => (
          <div key={movie.id} className="snap-start shrink-0">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieRow;
