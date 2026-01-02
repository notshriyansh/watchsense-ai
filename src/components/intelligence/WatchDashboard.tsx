import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../utils/hooks";
import {
  selectWatchState,
  selectInProgressOnly,
} from "../../utils/watch/watchSelectors";
import { fetchWatchingProfile } from "../../utils/watch/profileSlice";
import type { RootState } from "../../utils/appStore";
import WatchLogger from "./WatchLogger";
import LetterboxdImport from "./LetterboxdImport";
import MovieCard from "../MovieCard";
import TasteVector from "./TasteVector";

const WatchDashboard = () => {
  const dispatch = useAppDispatch();

  const watchHistory = useAppSelector(selectWatchState);
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

  const completionRate =
    totalStarted > 0 ? Math.round((completedCount / totalStarted) * 100) : 0;

  const handleShowProfile = () => {
    setShowProfile(true);
    if (!profileText && profileStatus === "idle") {
      dispatch(fetchWatchingProfile(watchHistory));
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      <main className="pt-24 px-6 md:px-12 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Viewing Intelligence</h1>
        <p className="text-gray-400 text-sm mb-6">
          Behavioral analysis derived from your viewing activity
        </p>
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setShowLogger(true)}
            className="bg-indigo-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-500 transition"
          >
            Log Activity
          </button>

          <button
            onClick={() => setShowImport(true)}
            className="border border-white/20 px-4 py-2 rounded-md text-sm hover:bg-white/10 transition"
          >
            Import History
          </button>

          <button
            onClick={handleShowProfile}
            className="border border-white/20 px-4 py-2 rounded-md text-sm hover:bg-white/10 transition"
          >
            Generate AI Profile
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Titles Started" value={totalStarted} />
          <StatCard label="Completed" value={completedCount} />
          <StatCard label="In Progress" value={inProgress.length} />
          <StatCard label="Completion Rate" value={`${completionRate}%`} />
        </div>

        <TasteVector />

        {showProfile && (
          <div className="bg-neutral-900/70 border border-white/10 rounded-xl p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">AI Viewing Profile</h2>

            {profileStatus === "loading" && (
              <p className="text-gray-400 text-sm">Analyzing behavior…</p>
            )}

            {profileText && (
              <div className="space-y-4">
                {parseProfile(profileText).map((section, idx) => (
                  <ProfileCard
                    key={idx}
                    title={section.title}
                    content={section.content}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-1">Logged Titles</h2>
          <p className="text-xs text-gray-400 mb-3">
            Content you have interacted with
          </p>

          {watchHistory.length === 0 ? (
            <p className="text-gray-400 text-sm">No activity logged yet.</p>
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
        </section>
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
  <div className="bg-neutral-900/70 border border-white/10 rounded-lg p-4 text-center">
    <div className="text-2xl font-semibold">{value}</div>
    <div className="text-xs text-gray-400 mt-1">{label}</div>
  </div>
);

const ProfileCard = ({
  title,
  content,
}: {
  title: string;
  content: string[];
}) => (
  <div className="bg-[#0B0F14] border border-white/10 rounded-lg p-4">
    <h3 className="text-sm font-semibold text-indigo-400 mb-2">{title}</h3>
    <ul className="space-y-1 text-sm text-gray-300">
      {content.map((line, i) => (
        <li key={i}>• {line}</li>
      ))}
    </ul>
  </div>
);

function parseProfile(text: string) {
  const sections: { title: string; content: string[] }[] = [];

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let current: { title: string; content: string[] } | null = null;

  for (const line of lines) {
    if (line.startsWith("**") && line.endsWith("**")) {
      if (current) sections.push(current);
      current = {
        title: line.replace(/\*/g, ""),
        content: [],
      };
    } else if (current) {
      current.content.push(line.replace(/^- /, ""));
    }
  }

  if (current) sections.push(current);
  return sections;
}
