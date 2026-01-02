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
      if (user) {
        navigate("/browse");
      }
    });

    return () => unsubscribe();
  }, []);
  const handleButtonClick = () => {
    const emailValue = email.current?.value;
    const passwordValue = password.current?.value;

    if (!emailValue || !passwordValue) return;

    const errorMessage = checkValidData(emailValue, passwordValue);
    setErrorMessage(errorMessage);
    if (errorMessage) return;

    if (!isSignInForm) {
      createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current?.value || "",
            photoURL: "https://avatars.githubusercontent.com/u/137698358?v=4",
          })
            .then(() => {
              navigate("/browse");
            })
            .catch((error) => {
              setErrorMessage(error.code + "-" + error.message);
            });

          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    } else {
      signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          navigate("/browse");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  const toggleSignInForm = () => {
    setErrorMessage(null);
    setIsSignForm(!isSignInForm);
  };

  return (
    <div className="relative h-screen w-screen">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="https://assets.nflxext.com/ffe/siteui/vlv3/6d631aa6-567d-46ef-a644-b5b00e4334d2/web/IN-en-20251215-TRIFECTA-perspective_f1cab02a-e42b-4913-a7d9-c5fe0f94f68d_large.jpg"
        alt="Netflix background"
      />

      <div className="relative z-10">
        <Header />
      </div>

      <div className="relative z-10 flex justify-center items-center h-full">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-black/75 p-10 rounded-lg w-112.5 text-white"
        >
          <h1 className="font-bold text-3xl py-4">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </h1>
          <input
            ref={name}
            type="text"
            placeholder="Full Name"
            className="w-full p-3 mb-6 bg-gray-800 text-white rounded"
          />

          <input
            ref={email}
            type="text"
            placeholder="Email Address"
            className="w-full p-3 mb-4 bg-transparent border border-gray-800 rounded
placeholder-gray-400 focus:outline-none focus:border-white"
          />
          <input
            ref={password}
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 bg-gray-800 text-white rounded"
          />
          <p className="text-red-600 font-bold text-sm py-2">{errorMessage}</p>
          {!isSignInForm && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 mb-6 bg-gray-800 text-white rounded"
            />
          )}
          <button
            type="button"
            className="w-full p-3 bg-red-600 rounded font-semibold hover:bg-red-700"
            onClick={handleButtonClick}
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>

          <p className="mt-6 text-gray-400">
            {isSignInForm ? "New to Netflix? " : "Already a member? "}
            <span
              onClick={toggleSignInForm}
              className="text-white cursor-pointer hover:underline"
            >
              {isSignInForm ? "Sign up now." : "Sign in now."}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
