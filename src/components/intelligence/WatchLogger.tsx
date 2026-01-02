import { useState } from "react";
import { useAppDispatch } from "../../utils/hooks";
import { upsertWatchProgress } from "../../utils/watch/watchSlice";
import { searchTMDBMovie, searchTMDBTV } from "../../utils/tmdbClient";
import MovieCard from "../MovieCard";
import OTTProviders from "../OTTProviders";

type SearchItem = {
  id: number;
  title: string;
  poster_path: string;
  media_type: "movie" | "tv";
};

const WatchLogger = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [progress, setProgress] = useState(50);
  const [status, setStatus] = useState<"watching" | "completed" | "dropped">(
    "watching"
  );
  const [note, setNote] = useState("");

  const search = async () => {
    if (!query.trim()) return;

    const [movies, tv] = await Promise.all([
      searchTMDBMovie(query),
      searchTMDBTV(query),
    ]);

    const combined: SearchItem[] = [
      ...tv.map((t: any) => ({
        id: t.id,
        title: t.name,
        poster_path: t.poster_path,
        media_type: "tv" as const,
      })),
      ...movies.map((m: any) => ({
        id: m.id,
        title: m.title,
        poster_path: m.poster_path,
        media_type: "movie" as const,
      })),
    ];

    setResults(combined);
  };

  const resolveProgress = () => {
    if (status === "completed") return 100;
    if (status === "dropped") return Math.min(progress, 30);
    return progress;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex justify-center items-center">
      <div className="bg-[#0B0F14] border border-white/10 rounded-xl w-[95vw] sm:w-[90vw] max-w-4xl h-[90vh] sm:h-[85vh] p-4 sm:p-6 text-white flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Log Viewing Activity</h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 bg-gray-800 p-3 rounded-md"
            placeholder="Search movie or TV series"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
          <button
            onClick={search}
            className="bg-indigo-600 px-5 rounded-md font-semibold hover:bg-indigo-500"
          >
            Search
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {results.map((item) => (
              <div
                key={`${item.media_type}-${item.id}`}
                className="cursor-pointer"
                onClick={() => {
                  dispatch(
                    upsertWatchProgress({
                      movieId: item.id,
                      title: item.title,
                      posterPath: item.poster_path,
                      progressPercent: resolveProgress(),
                      lastWatchedAt: Date.now(),
                      status,
                      note,
                    })
                  );
                  onClose();
                }}
              >
                <MovieCard
                  movie={
                    {
                      id: item.id,
                      title: item.title,
                      poster_path: item.poster_path,
                    } as any
                  }
                  onHover={() => {}}
                  onLeave={() => {}}
                />

                <OTTProviders movieId={item.id} />

                <p className="text-xs text-center text-gray-400 mt-1">
                  {item.media_type === "tv" ? "TV Series" : "Movie"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-gray-800 p-2 rounded"
              >
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400">Progress (%)</label>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(+e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <textarea
            placeholder="Optional note (why you stopped / liked it)"
            className="w-full bg-gray-800 p-2 rounded mt-3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default WatchLogger;
