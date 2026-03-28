import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../utils/hooks";
import { LOGO, DEFAULT_AVATAR } from "../utils/constants";
import GPTSearch from "./GPTSearch";
import { clearPersistedData } from "../utils/storage";

const Header = () => {
  const navigate = useNavigate();
  const user = useAppSelector((store) => store.user);

  const [showGPT, setShowGPT] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSignout = () => {
    clearPersistedData();
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
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 pt-safe ${
          isScrolled ? "bg-[#0B0F14]/95 backdrop-blur-md border-b border-white/5 py-3" : "bg-gradient-to-b from-[#0B0F14]/80 to-transparent py-5"
        }`}
      >
        <div className="flex items-center justify-between px-6 sm:px-12">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/browse")}
          >
            <img className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 opacity-90" src={LOGO} alt="CineMind Logo" />
            <span className="hidden sm:block text-[#E6EAF0] font-serif font-medium tracking-tight text-xl">
              CineMind AI
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden sm:block text-sm font-medium text-[#8A93A3] hover:text-[#E6EAF0] transition-colors"
            >
              Intelligence
            </button>

            <button
              onClick={() => navigate("/watchlist")}
              className="hidden sm:block text-sm font-medium text-[#8A93A3] hover:text-[#E6EAF0] transition-colors"
            >
              Watchlist
            </button>

            {user && (
              <button
                onClick={() => setShowGPT(true)}
                className="flex items-center gap-2 bg-[#0E1622] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 px-4 py-2 rounded text-sm font-medium text-[#E6EAF0] text-cyan-50 transition-all group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Ask AI
              </button>
            )}

            <button
              onClick={() => setShowMobileMenu(true)}
              className="sm:hidden p-2 text-[#8A93A3] hover:text-[#E6EAF0]"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {user && (
              <div className="hidden md:flex items-center gap-4 pl-4 border-l border-white/10">
                <img
                  className="w-8 h-8 rounded-sm object-cover border border-white/5 opacity-90"
                  src={user.photoURL || DEFAULT_AVATAR}
                  alt="User avatar"
                />
                <button
                  onClick={handleSignout}
                  className="text-[#8A93A3] hover:text-[#E6EAF0] text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-[#0B0F14]/90 backdrop-blur-md">
          <div className="absolute top-0 w-full p-6 flex justify-end">
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-2 text-[#8A93A3] hover:text-[#E6EAF0]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <button
              onClick={() => {
                navigate("/dashboard");
                setShowMobileMenu(false);
              }}
              className="text-2xl font-serif text-[#E6EAF0] hover:text-cyan-400 transition-colors"
            >
              Viewing Intelligence
            </button>

            <button
              onClick={() => {
                navigate("/watchlist");
                setShowMobileMenu(false);
              }}
              className="text-2xl font-serif text-[#E6EAF0] hover:text-cyan-400 transition-colors"
            >
              Watchlist
            </button>

            <button
              onClick={() => {
                setShowGPT(true);
                setShowMobileMenu(false);
              }}
              className="text-2xl font-serif text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              Ask AI
            </button>

            <button
              onClick={handleSignout}
              className="mt-8 text-lg font-medium text-[#8A93A3] hover:text-[#E6EAF0] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {showGPT && <GPTSearch onClose={() => setShowGPT(false)} />}
    </>
  );
};

export default Header;
