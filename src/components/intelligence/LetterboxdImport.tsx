import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { importFromText } from "../../utils/watch/importSlice";
import type { RootState } from "../../utils/appStore";

const LetterboxdImport = ({ onClose }: { onClose: () => void }) => {
  const [text, setText] = useState("");
  const dispatch = useAppDispatch();
  const { status, count } = useAppSelector((s: RootState) => s.import);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex justify-center items-center">
      <div className="bg-[#0B0F14] border border-white/10 p-6 rounded-xl w-[90vw] max-w-md max-h-[85vh] overflow-y-auto text-white">
        <h2 className="text-lg font-semibold mb-1">
          Import External Watch History
        </h2>
        <p className="text-gray-400 text-sm mb-3">
          Paste titles from Letterboxd or any list (one per line)
        </p>

        <textarea
          className="w-full bg-gray-800 p-3 rounded-md h-32 text-sm"
          placeholder={`Inception\nParasite\nWhiplash`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={() => dispatch(importFromText(text))}
          className="bg-indigo-600 px-4 py-2 rounded-md text-sm font-semibold mt-3 hover:bg-indigo-500"
          disabled={status === "loading"}
        >
          Import Titles
        </button>

        {status === "loading" && (
          <p className="text-gray-400 text-sm mt-2">Processing…</p>
        )}

        {status === "done" && (
          <p className="text-emerald-400 text-sm mt-2">
            Imported {count} titles
          </p>
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
