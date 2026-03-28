import { useState, useRef, useEffect } from "react";
import { checkValidData } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { LOGO } from "../utils/constants";

const Login = () => {
  const navigate = useNavigate();
  const [isSignInForm, setIsSignForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/browse");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleButtonClick = () => {
    const emailValue = email.current?.value;
    const passwordValue = password.current?.value;
    if (!emailValue || !passwordValue) return;

    const error = checkValidData(emailValue, passwordValue);
    setErrorMessage(error);
    if (error) return;

    if (!isSignInForm) {
      createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then(({ user }) =>
          updateProfile(user, {
            displayName: name.current?.value || "",
            photoURL: "https://api.dicebear.com/7.x/identicon/svg?seed=user",
          }).then(() => navigate("/browse"))
        )
        .catch((e) => setErrorMessage(e.message));
    } else {
      signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then(() => navigate("/browse"))
        .catch((e) => setErrorMessage(e.message));
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-[#0B0F14] overflow-hidden selection:bg-cyan-500/20 font-sans">

      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-overlay grayscale"
          src="https://images.unsplash.com/photo-1485846234645-a62644f84728"
          alt="Cinematic Grain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/80 to-[#0B0F14]/40" />
      </div>

      <div className="absolute top-8 left-8 sm:top-12 sm:left-12 z-20 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <img className="w-8 h-8 sm:w-10 sm:h-10 opacity-90" src={LOGO} alt="CineMind Logo" />
        <span className="hidden sm:block text-xl font-serif font-medium tracking-tight text-[#E6EAF0]">
          CineMind AI
        </span>
      </div>

      <div className="relative z-10 w-full max-w-sm px-4 sm:px-0">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-[#0E1622]/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-white/5 w-full flex flex-col animate-slide-up shadow-2xl"
        >
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-medium text-[#E6EAF0] tracking-tight mb-2">
              {isSignInForm ? "Welcome Back" : "Create Profile"}
            </h1>
            <p className="text-[#8A93A3] text-sm">
              {isSignInForm
                ? "Sign in to access your intelligence dashboard."
                : "Join CineMind to begin tracking."}
            </p>
          </div>

          <div className="space-y-4">
            {!isSignInForm && (
              <input
                ref={name}
                type="text"
                placeholder="Full Name"
                className="w-full p-3.5 bg-[#0B0F14] border border-white/10 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors text-[#E6EAF0] placeholder-[#8A93A3] text-sm"
              />
            )}

            <input
              ref={email}
              type="text"
              placeholder="Email Address"
              className="w-full p-3.5 bg-[#0B0F14] border border-white/10 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors text-[#E6EAF0] placeholder-[#8A93A3] text-sm"
            />

            <input
              ref={password}
              type="password"
              placeholder="Password"
              className="w-full p-3.5 bg-[#0B0F14] border border-white/10 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors text-[#E6EAF0] placeholder-[#8A93A3] text-sm"
            />
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-400 text-xs font-medium">{errorMessage}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleButtonClick}
            className="w-full mt-8 py-3.5 bg-[#E6EAF0] hover:bg-white text-[#0B0F14] rounded-lg font-medium text-sm transition-colors active:scale-[0.98]"
          >
            {isSignInForm ? "Sign In" : "Continue"}
          </button>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsSignForm(!isSignInForm)}
              className="text-[#8A93A3] hover:text-[#E6EAF0] text-sm transition-colors border-b border-transparent hover:border-[#E6EAF0] pb-0.5"
            >
              {isSignInForm ? "Create an account" : "Sign in to existing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
