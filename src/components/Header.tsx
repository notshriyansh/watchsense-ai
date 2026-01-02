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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSignout = () => {
    signOut(auth)
      .then(() => navigate("/"))
      .catch(() => navigate("/error"));
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowGPT(false);
        setShowMobileMenu(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <header
        className="
          fixed top-0 left-0 w-full z-50
          bg-[#0B0F14]/95 backdrop-blur
          pt-safe
        "
      >
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGPT(true)}
              className="
                bg-indigo-600
                px-4 py-2
                rounded-md
                text-sm font-semibold
                text-white
                hover:bg-indigo-500
                transition
              "
            >
              Ask CineMind
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="
                hidden sm:block
                text-gray-300 text-sm
                hover:text-white transition
              "
            >
              Intelligence
            </button>

            <button
              onClick={() => setShowMobileMenu(true)}
              className="sm:hidden p-2 text-gray-300 hover:text-white"
              aria-label="Open menu"
            >
              ☰
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
                  className="
                    hidden md:block
                    text-gray-300 text-sm
                    hover:text-white
                  "
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur">
          <div
            className="
              absolute bottom-0 left-0 right-0
              bg-[#0B0F14]
              border-t border-white/10
              rounded-t-2xl
              p-6
              animate-slide-up
              pb-safe
            "
          >
            <button
              onClick={() => {
                navigate("/dashboard");
                setShowMobileMenu(false);
              }}
              className="w-full text-left py-3 text-lg font-semibold text-white"
            >
              Viewing Intelligence
            </button>

            <button
              onClick={() => {
                setShowGPT(true);
                setShowMobileMenu(false);
              }}
              className="w-full text-left py-3 text-lg font-semibold text-white"
            >
              Ask CineMind
            </button>

            <button
              onClick={handleSignout}
              className="w-full text-left py-3 text-lg font-semibold text-red-400"
            >
              Sign Out
            </button>

            <button
              onClick={() => setShowMobileMenu(false)}
              className="w-full mt-4 text-sm text-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showGPT && <GPTSearch onClose={() => setShowGPT(false)} />}
    </>
  );
};

export default Header;
