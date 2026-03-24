import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../utils/hooks";
import {
  selectWatchState,
} from "../../utils/watch/watchSelectors";
import { fetchWatchingProfile } from "../../utils/watch/profileSlice";
import type { RootState } from "../../utils/appStore";
import WatchLogger from "./WatchLogger";
import LetterboxdImport from "./LetterboxdImport";
import TasteVector from "./TasteVector";
export interface WatchItem {
  movieId: number;
  title: string;
  posterPath: string | null;
  progressPercent: number;
  status: "plan_to_watch" | "watching" | "completed" | "dropped";
}

const WatchDashboard = () => {
  const dispatch = useAppDispatch();

  const watchHistory = useAppSelector(selectWatchState);

  const profileText = useAppSelector(
    (state: RootState) => state.profile.profileText
  );
  const profileStatus = useAppSelector(
    (state: RootState) => state.profile.status
  );

  const [showLogger, setShowLogger] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const totalStarted = watchHistory.length;
  const completedCount = watchHistory.filter((item) => item.progressPercent === 100).length;
  const droppedCount = watchHistory.filter((item) => item.status === "dropped").length;

  const completionRate =
    totalStarted > 0 ? Math.round((completedCount / totalStarted) * 100) : 0;

  const handleShowProfile = () => {
    if (profileStatus === "idle") {
      dispatch(fetchWatchingProfile(watchHistory));
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EAF0] selection:bg-cyan-500/20 font-sans pb-24">

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
      </div>

      <main className="relative z-10 pt-32 px-6 sm:px-12 max-w-7xl mx-auto space-y-16">

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-light mb-2">Viewing Intelligence</h1>
            <p className="text-[#8A93A3] text-sm">
              Behavioral analysis derived from your interaction patterns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowLogger(true)}
              className="bg-[#E6EAF0] text-[#0B0F14] font-medium px-5 py-2.5 rounded hover:bg-white transition-colors flex items-center gap-2 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Log Activity
            </button>

            <button
              onClick={() => setShowImport(true)}
              className="bg-[#0E1622] hover:bg-white/5 border border-white/10 text-[#E6EAF0] px-5 py-2.5 rounded transition-colors text-sm"
            >
              Import Data
            </button>
          </div>
        </header>

        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard label="Titles Logged" value={totalStarted} />
            <StatCard label="Completed" value={completedCount} />
            <StatCard label="Dropped" value={droppedCount} />
            <StatCard label="Completion Rate" value={`${completionRate}%`} />
          </div>
        </section>

        <section>
          <div className="bg-[#0E1622] rounded-2xl border border-white/5 p-8 relative overflow-hidden shadow-2xl">
            <h2 className="text-xl font-serif mb-6 text-[#E6EAF0]">Taste Distribution</h2>
            <div className="relative z-10">
              <TasteVector />
            </div>
          </div>
        </section>

        <section>
          <div className="bg-[#0E1622] rounded-2xl border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500"></div>

            <div className="p-8 sm:p-10 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <span className="text-xs font-mono text-cyan-500 tracking-widest uppercase">AI Synthesis</span>
                </div>
                <h2 className="text-2xl font-serif text-[#E6EAF0]">Behavioral Assessment</h2>
              </div>

              {((!profileText && profileStatus !== "loading") || profileStatus === "failed") && (
                <button
                  onClick={handleShowProfile}
                  className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 px-5 py-2.5 rounded text-sm transition-colors flex items-center gap-2 font-medium"
                >
                  Generate Profile
                </button>
              )}
            </div>

            <div className="p-8 sm:p-10 bg-[#0B0F14]/30 min-h-[200px]">
              {profileStatus === "idle" && !profileText && (
                <div className="flex items-center justify-center h-full text-[#8A93A3] text-sm">
                  Initialize synthesis to generate your viewing psychographics.
                </div>
              )}

              {profileStatus === "loading" && (
                <div className="flex flex-col items-center justify-center h-full gap-4 pt-8 pb-4">
                  <span className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                  <p className="text-sm font-mono tracking-wide text-cyan-500">Processing behavioral matrices...</p>
                </div>
              )}

              {profileText && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                  {parseProfile(profileText).map((section, idx) => (
                    <div key={idx} className="border-l-2 border-white/5 pl-5">
                      <h3 className="text-sm font-medium text-[#E6EAF0] uppercase tracking-wider mb-3">
                        {section.title}
                      </h3>
                      <ul className="space-y-3">
                        {section.content.map((item, i) => (
                          <li key={i} className="text-sm text-[#8A93A3] leading-relaxed flex items-start">
                            <span className="text-cyan-500 mr-2 mt-0.5">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <div>
            <h2 className="text-xl font-serif mb-2 text-[#E6EAF0]">Activity Log</h2>
            <p className="text-xs text-[#8A93A3] mb-6 tracking-wide uppercase">Raw Data Feed</p>
          </div>

          {watchHistory.length === 0 ? (
            <div className="border border-white/5 border-dashed rounded-xl p-12 text-center">
              <p className="text-[#8A93A3] text-sm">No activity recorded inside the intelligence matrix.</p>
            </div>
          ) : (
            <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-6 pt-2 snap-x">
              {watchHistory.map((item) => (
                <div key={item.movieId} className="snap-start shrink-0">
                  <LoggedMovieCard item={item} />
                </div>
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

const StatCard = ({ label, value }: { label: string; value: number | string }) => (
  <div className="bg-[#0E1622] rounded-xl border border-white/5 p-6 hover:border-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-black/50 flex flex-col group">
    <div className="text-xs font-medium text-[#8A93A3] uppercase tracking-widest mb-3 group-hover:text-cyan-500/70 transition-colors">
      {label}
    </div>
    <div className="text-4xl font-light text-[#E6EAF0]">{value}</div>
  </div>
);

const LoggedMovieCard = ({ item }: { item: WatchItem }) => {
  const posterUrl = item.posterPath
    ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
    : "data:image/png;base64,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";

  const getStatusBadge = () => {
    switch (item.status) {
      case "completed": return <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded backdrop-blur border border-emerald-500/20">Completed</span>;
      case "dropped": return <span className="bg-red-500/20 text-red-400 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded backdrop-blur border border-red-500/20">Dropped</span>;
      case "watching": return <span className="bg-cyan-500/20 text-cyan-400 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded backdrop-blur border border-cyan-500/20">In Progress</span>;
      case "plan_to_watch": return <span className="bg-white/10 text-white border border-white/10 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded backdrop-blur">Queued</span>;
      default: return null;
    }
  };

  return (
    <div className="relative w-36 md:w-44 shrink-0 rounded-lg overflow-hidden border border-white/5 bg-[#0E1622] group hover:border-cyan-500/30 transition-all cursor-pointer">
      <div className="aspect-[2/3] w-full relative">
        <img
          src={posterUrl}
          alt={item.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-[#0B0F14]/60 pointer-events-none" />

        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 shadow-2xl">
          {getStatusBadge()}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 pt-6 pointer-events-none">
        <h3 className="text-[#E6EAF0] font-medium text-xs leading-snug line-clamp-2 drop-shadow-lg">
          {item.title}
        </h3>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className={`h-full ${item.status === 'completed' ? 'bg-emerald-500' : 'bg-cyan-500'}`}
          style={{ width: `${item.progressPercent}%` }}
        />
      </div>
    </div>
  );
};

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
      if (line !== "") current.content.push(line.replace(/^- /, ""));
    }
  }

  if (current) sections.push(current);
  return sections;
}
