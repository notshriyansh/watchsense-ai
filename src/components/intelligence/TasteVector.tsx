import { useState } from "react";
import { useAppSelector } from "../../utils/hooks";
import { selectWatchState } from "../../utils/watch/watchSelectors";

const TasteVector = () => {
  const [open, setOpen] = useState(false);
  const watchHistory = useAppSelector(selectWatchState);

  if (watchHistory.length === 0) return null;

  const completed = watchHistory.filter(
    (w) => w.progressPercent === 100
  ).length;

  const dropped = watchHistory.filter((w) => w.status === "dropped").length;

  return (
    <div className="bg-neutral-900/70 border border-white/10 rounded-xl p-6 mb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Taste Vector</h2>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-sm text-indigo-400 hover:underline"
        >
          {open ? "Hide" : "View"}
        </button>
      </div>

      {!open && (
        <p className="text-sm text-gray-400 mt-2">
          A lightweight behavioral summary based on your activity.
        </p>
      )}

      {open && (
        <div className="mt-5 space-y-4 text-sm text-gray-300">
          <div>
            <span className="text-indigo-400 font-semibold">
              Completion Bias:
            </span>{" "}
            {completed > dropped
              ? "You prefer finishing what you start"
              : "You drop content early if it doesn’t engage you"}
          </div>

          <div>
            <span className="text-indigo-400 font-semibold">
              Exploration Style:
            </span>{" "}
            {watchHistory.length > 10
              ? "Explorer — you try a wide range of titles"
              : "Selective — you choose carefully"}
          </div>

          <div>
            <span className="text-indigo-400 font-semibold">
              Engagement Depth:
            </span>{" "}
            {completed > 5
              ? "Deep engagement with chosen content"
              : "Light engagement across multiple titles"}
          </div>
        </div>
      )}
    </div>
  );
};

export default TasteVector;
