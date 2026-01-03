import { useState } from "react";
import { useAppDispatch } from "../../utils/hooks";
import { upsertWatchProgress } from "../../utils/watch/watchSlice";
import { searchTMDBMovie, searchTMDBTV } from "../../utils/tmdbClient";
import MovieCard from "../MovieCard";
import OTTProviders from "../OTTProviders";

type SearchItem = {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
};

type MovieProgress = "started" | "halfway" | "completed";
type WatchStatus = "watching" | "completed" | "dropped";

const WatchLogger = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);

  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const [movieProgress, setMovieProgress] = useState<MovieProgress>("started");

  const [status, setStatus] = useState<WatchStatus>("watching");
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

  const computeProgressPercent = (): number => {
    if (!selectedItem) return 0;

    if (selectedItem.media_type === "movie") {
      if (movieProgress === "completed") return 100;
      if (movieProgress === "halfway") return 50;
      return 20;
    }

    return Math.min(100, Math.max(5, Math.round((episode / 10) * 100)));
  };

  const saveActivity = () => {
    if (!selectedItem) return;

    dispatch(
      upsertWatchProgress({
        movieId: selectedItem.id,
        title: selectedItem.title,
        posterPath: selectedItem.poster_path ?? "",
        progressPercent: computeProgressPercent(),
        lastWatchedAt: Date.now(),
        status,
        note,
      })
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center px-3">
      <div className="bg-[#0B0F14] border border-white/10 rounded-xl w-full max-w-4xl h-[90vh] p-4 sm:p-6 text-white flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            Log Viewing Activity
          </h2>
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
            className="bg-indigo-600 px-4 rounded-md font-semibold hover:bg-indigo-500"
          >
            Search
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {results.map((item) => (
              <div
                key={`${item.media_type}-${item.id}`}
                className={`cursor-pointer rounded-lg ${
                  selectedItem?.id === item.id ? "ring-2 ring-indigo-500" : ""
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <MovieCard movie={item} />

                <OTTProviders movieId={item.id} />

                <p className="text-xs text-center text-gray-400 mt-1">
                  {item.media_type === "tv" ? "TV Series" : "Movie"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {selectedItem && (
          <div className="mt-4 border-t border-white/10 pt-4 space-y-4">
            {selectedItem.media_type === "tv" ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Season</label>
                  <input
                    type="number"
                    min={1}
                    value={season}
                    onChange={(e) => setSeason(+e.target.value)}
                    className="w-full bg-gray-800 p-2 rounded"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400">Episode</label>
                  <input
                    type="number"
                    min={1}
                    value={episode}
                    onChange={(e) => setEpisode(+e.target.value)}
                    className="w-full bg-gray-800 p-2 rounded"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm text-gray-400">Progress</label>
                <select
                  value={movieProgress}
                  onChange={(e) =>
                    setMovieProgress(e.target.value as MovieProgress)
                  }
                  className="w-full bg-gray-800 p-2 rounded"
                >
                  <option value="started">Just started</option>
                  <option value="halfway">Halfway through</option>
                  <option value="completed">Finished</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-sm text-gray-400">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as WatchStatus)}
                className="w-full bg-gray-800 p-2 rounded"
              >
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            <textarea
              placeholder="Optional note (why you stopped / liked it)"
              className="w-full bg-gray-800 p-2 rounded"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <button
              onClick={saveActivity}
              className="w-full bg-indigo-600 py-2 rounded-md font-semibold hover:bg-indigo-500"
            >
              Save Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchLogger;
