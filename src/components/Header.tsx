import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../utils/hooks";
import { LOGO, DEFAULT_AVATAR } from "../utils/constants";
import GPTSearch from "./GPTSearch";

const Header = () => {
  const navigate = useNavigate();
  const user = useAppSelector((store) => store.user);
  const [showGPT, setShowGPT] = useState(false);

  const handleSignout = () => {
    signOut(auth)
      .then(() => navigate("/"))
      .catch(() => navigate("/error"));
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowGPT(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-linear-to-b from-[#0B0F14]/95 to-transparent backdrop-blur">
        <div className="flex items-center justify-between px-4 md:px-8 py-3">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/browse")}
          >
            <img className="w-8 h-8" src={LOGO} alt="CineMind Logo" />
            <span className="text-white font-semibold text-lg">
              CineMind AI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowGPT(true)}
              className="bg-indigo-600 px-4 py-2 rounded-md text-sm font-semibold text-white hover:bg-indigo-500 transition"
            >
              Ask CineMind
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-300 text-sm hover:text-white transition"
            >
              Intelligence
            </button>

            {user && (
              <>
                <img
                  className="w-9 h-9 rounded-full object-cover"
                  src={user.photoURL || DEFAULT_AVATAR}
                  alt="User avatar"
                />

                <button
                  onClick={handleSignout}
                  className="hidden md:block text-gray-300 text-sm hover:text-white"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {showGPT && <GPTSearch onClose={() => setShowGPT(false)} />}
    </>
  );
};

export default Header;
