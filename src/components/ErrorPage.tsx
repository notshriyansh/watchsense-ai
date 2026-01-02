import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-black via-black/80 to-red-900/20" />

      <div className="relative z-10 text-center max-w-lg px-6">
        <h1 className="text-7xl font-extrabold text-red-600 mb-4 animate-pulse">
          Oops!
        </h1>
        <h2 className="text-2xl font-semibold mb-3">Something went wrong</h2>
        <p className="text-gray-400 mb-8">
          We’re having trouble loading this page right now. Please try again or
          return to safety.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-red-600 rounded font-semibold hover:bg-red-700 transition cursor-pointer"
          >
            Go Home
          </button>

          <button
            onClick={() => window.location.reload()} // Retry
            className="px-6 py-3 border border-gray-500 rounded font-semibold hover:bg-white hover:text-black transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>

      <p className="absolute bottom-6 text-xs text-gray-500">
        Error • NetflixGPT
      </p>
    </div>
  );
};

export default ErrorPage;
