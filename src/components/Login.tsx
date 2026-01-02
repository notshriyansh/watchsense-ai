import { useState, useRef, useEffect } from "react";
import Header from "./Header";
import { checkValidData } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

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
  }, []);

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
    <div className="relative h-screen w-screen">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1535223289827-42f1e9919769"
        alt="CineMind background"
      />

      <Header />

      <div className="relative z-10 flex justify-center items-center h-full">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-black/70 backdrop-blur p-10 rounded-lg w-112.5 text-white"
        >
          <h1 className="font-bold text-3xl py-4">
            {isSignInForm
              ? "Sign in to CineMind"
              : "Create your CineMind account"}
          </h1>

          {!isSignInForm && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="w-full p-3 mb-4 bg-gray-800 rounded"
            />
          )}

          <input
            ref={email}
            type="text"
            placeholder="Email Address"
            className="w-full p-3 mb-4 bg-gray-800 rounded"
          />

          <input
            ref={password}
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 bg-gray-800 rounded"
          />

          {errorMessage && (
            <p className="text-red-400 text-sm mb-2">{errorMessage}</p>
          )}

          <button
            type="button"
            onClick={handleButtonClick}
            className="w-full p-3 bg-indigo-600 rounded font-semibold hover:bg-indigo-500"
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>

          <p className="mt-6 text-gray-400">
            {isSignInForm ? "New to CineMind? " : "Already using CineMind? "}
            <span
              onClick={() => setIsSignForm(!isSignInForm)}
              className="text-white cursor-pointer hover:underline"
            >
              {isSignInForm ? "Create an account." : "Sign in."}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
