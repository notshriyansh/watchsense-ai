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
      <header className="fixed top-0 left-0 w-full z-50 bg-linear-to-b from-black/90 to-black/20">
        <div className="flex items-center justify-between px-4 md:px-8 py-3">
          <img
            className="w-28 md:w-40 cursor-pointer"
            src={LOGO}
            alt="Netflix Logo"
            onClick={() => navigate("/browse")}
          />

          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setShowGPT(true)}
              className="bg-red-600 px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base font-semibold text-white hover:bg-red-700 transition"
            >
              GPT Search
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="text-white text-sm hover:underline"
            >
              Dashboard
            </button>

            {user && (
              <>
                <img
                  className="w-8 h-8 md:w-10 md:h-10 rounded object-cover"
                  src={user.photoURL || DEFAULT_AVATAR}
                  alt={user.displayName || "User avatar"}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                />

                <button
                  onClick={handleSignout}
                  className="hidden md:block text-white text-sm hover:underline"
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
