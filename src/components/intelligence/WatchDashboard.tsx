import Header from "../Header";
import { useAppSelector, useAppDispatch } from "../../utils/hooks";
import {
  selectWatchState,
  selectDroppedItems,
  selectInProgressOnly,
} from "../../utils/watch/watchSelectors";
import { fetchWatchingProfile } from "../../utils/watch/profileSlice";
import type { RootState } from "../../utils/appStore";
import { useState } from "react";
import WatchLogger from "./WatchLogger";
import LetterboxdImport from "./LetterboxdImport";
import MovieCard from "../MovieCard";

const WatchDashboard = () => {
  const dispatch = useAppDispatch();

  const watchHistory = useAppSelector(selectWatchState);
  const dropped = useAppSelector(selectDroppedItems);
  const inProgress = useAppSelector(selectInProgressOnly);

  const profileText = useAppSelector(
    (state: RootState) => state.profile.profileText
  );
  const profileStatus = useAppSelector(
    (state: RootState) => state.profile.status
  );

  const [showLogger, setShowLogger] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const totalStarted = watchHistory.length;
  const completedCount = watchHistory.filter(
    (item) => item.progressPercent === 100
  ).length;
  const droppedCount = dropped.length;

  const completionRate =
    totalStarted > 0 ? Math.round((completedCount / totalStarted) * 100) : 0;

  const handleShowProfile = () => {
    setShowProfile(true);

    if (!profileText && profileStatus === "idle") {
      dispatch(fetchWatchingProfile(watchHistory));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-20 px-6 md:px-12 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Watch Dashboard</h1>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowLogger(true)}
            className="bg-red-600 px-4 py-2 rounded text-sm font-semibold hover:bg-red-700"
          >
            Log What I Watched
          </button>

          <button
            onClick={() => setShowImport(true)}
            className="border border-gray-500 px-4 py-2 rounded text-sm hover:bg-gray-800"
          >
            Import from Letterboxd
          </button>

          <button
            onClick={handleShowProfile}
            className="border border-gray-500 px-4 py-2 rounded text-sm hover:bg-gray-800"
          >
            Show My AI Profile
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Titles Started" value={totalStarted} />
          <StatCard label="Completed" value={completedCount} />
          <StatCard label="Dropped" value={droppedCount} />
          <StatCard label="Completion Rate" value={`${completionRate}%`} />
        </div>

        {showProfile && (
          <div className="bg-neutral-900 rounded-xl p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">
              🤖 Your AI Watching Profile
            </h2>

            {profileStatus === "loading" && (
              <p className="text-gray-400 text-sm">Generating insights…</p>
            )}

            {profileStatus === "failed" && (
              <p className="text-red-400 text-sm">
                AI insights unavailable right now.
              </p>
            )}

            {profileText && (
              <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                {profileText.split("\n").map((line, idx) => (
                  <p
                    key={idx}
                    className={
                      line.startsWith("TITLE:")
                        ? "text-lg font-semibold text-white"
                        : line.endsWith(":")
                        ? "text-sm font-semibold text-gray-200 mt-4"
                        : ""
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-1">Your Logged Titles</h2>
          <p className="text-xs text-gray-400 mb-3">
            Based on what you’ve watched so far
          </p>

          {watchHistory.length === 0 ? (
            <p className="text-gray-400 text-sm">
              You haven’t logged any titles yet.
            </p>
          ) : (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {watchHistory.map((item) => (
                <MovieCard
                  key={item.movieId}
                  movie={
                    {
                      id: item.movieId,
                      title: item.title,
                      poster_path: item.posterPath,
                    } as any
                  }
                  onHover={() => {}}
                  onLeave={() => {}}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-neutral-900 rounded-lg p-6 mt-10">
          <h2 className="text-xl font-semibold mb-3">Your Watching Style</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {getWatchingStyle({
              completionRate,
              droppedCount,
              inProgressCount: inProgress.length,
            })}
          </p>
        </div>
      </main>

      {showLogger && <WatchLogger onClose={() => setShowLogger(false)} />}
      {showImport && <LetterboxdImport onClose={() => setShowImport(false)} />}
    </div>
  );
};

export default WatchDashboard;

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <div className="bg-neutral-900/70 rounded-lg p-4 text-center">
    <div className="text-xl font-semibold">{value}</div>
    <div className="text-xs text-gray-400 mt-1">{label}</div>
  </div>
);

function getWatchingStyle({
  completionRate,
  droppedCount,
  inProgressCount,
}: {
  completionRate: number;
  droppedCount: number;
  inProgressCount: number;
}) {
  if (completionRate >= 75) {
    return "You tend to fully commit to what you start and usually finish shows you begin.";
  }

  if (droppedCount > inProgressCount) {
    return "You explore a lot of content but drop things quickly if they don’t hook you early.";
  }

  if (inProgressCount > 3) {
    return "You like juggling multiple shows at once and watching at your own pace.";
  }

  return "You have a balanced watching style and selectively continue what interests you.";
}
