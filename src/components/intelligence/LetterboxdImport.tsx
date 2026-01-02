import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { importFromText } from "../../utils/watch/importSlice";
import type { RootState } from "../../utils/appStore";

const LetterboxdImport = ({ onClose }: { onClose: () => void }) => {
  const [text, setText] = useState("");
  const dispatch = useAppDispatch();
  const { status, count } = useAppSelector((s: RootState) => s.import);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center">
      <div className="bg-neutral-900 p-6 rounded w-full max-w-md text-white">
        <h2 className="text-lg font-semibold mb-2">
          Import from Letterboxd (Manual)
        </h2>

        <p className="text-gray-400 text-sm mb-3">
          Paste your favorite films (one per line).
        </p>

        <textarea
          className="w-full bg-gray-800 p-2 rounded h-32 text-sm"
          placeholder={`Inception
Parasite
Whiplash`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={() => dispatch(importFromText(text))}
          className="bg-red-600 px-4 py-2 rounded text-sm font-semibold mt-3 hover:bg-red-700"
          disabled={status === "loading"}
        >
          Import
        </button>

        {status === "loading" && (
          <p className="text-gray-400 text-sm mt-2">Importing…</p>
        )}

        {status === "done" && (
          <p className="text-green-400 text-sm mt-2">Imported {count} titles</p>
        )}

        {status === "failed" && (
          <p className="text-red-400 text-sm mt-2">Import failed. Try again.</p>
        )}

        <button
          onClick={onClose}
          className="text-gray-400 text-sm mt-4 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LetterboxdImport;
