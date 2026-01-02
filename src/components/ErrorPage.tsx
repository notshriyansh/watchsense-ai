import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh w-screen bg-black flex items-center justify-center text-white relative">
      <div className="absolute inset-0 bg-linear-to-b from-black via-black/80 to-indigo-900/20" />

      <div className="relative z-10 text-center max-w-lg px-6">
        <h1 className="text-7xl font-extrabold text-indigo-500 mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold mb-3">Something went wrong</h2>
        <p className="text-gray-400 mb-8">
          CineMind encountered an unexpected error.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-indigo-600 rounded hover:bg-indigo-500"
          >
            Go Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 border border-gray-500 rounded hover:bg-white hover:text-black"
          >
            Retry
          </button>
        </div>
      </div>

      <p className="absolute bottom-6 text-xs text-gray-500">
        CineMind AI • System Error
      </p>
    </div>
  );
};

export default ErrorPage;
