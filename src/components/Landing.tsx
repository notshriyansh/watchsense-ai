import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LOGO } from "../utils/constants";

const Landing = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EAF0] selection:bg-cyan-500/20 font-sans overflow-x-hidden">
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0B0F14]/90 backdrop-blur-md py-4 border-b border-white/5"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 sm:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 opacity-90"
              src={LOGO}
              alt="CineMind Logo"
            />
            <span className="text-xl font-serif font-medium tracking-tight">
              CineMind AI
            </span>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-[#8A93A3] hover:text-[#E6EAF0] transition-colors"
          >
            Sign In
          </button>
        </div>
      </header>

      <section className="relative flex flex-col justify-center items-center text-center px-6 min-h-[85vh]">
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="https://images.unsplash.com/photo-1485846234645-a62644f84728"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-[0.07] mix-blend-overlay grayscale"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0B0F14] via-[#0B0F14]/70 to-[#0B0F14]/20"></div>
        </div>

        <div className="relative z-10 max-w-4xl animate-slide-up opacity-0 [animation-delay:200ms]">
          <h1 className="text-5xl sm:text-7xl font-serif font-light tracking-tight mb-6 leading-[1.1]">
            Understand How <br /> You Watch.
          </h1>
          <p className="text-lg sm:text-xl text-[#8A93A3] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            An analytical media engine that monitors your behavior, predicts
            drop-off rates, and offers completely transparent AI
            recommendations.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#E6EAF0] text-[#0B0F14] px-8 py-3.5 rounded-lg font-medium hover:bg-white transition-colors shadow-lg active:scale-[0.98]"
          >
            Start Analyzing
          </button>
        </div>
      </section>

      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0E1622] p-8 rounded-xl border border-white/5 hover:border-cyan-500/20 transition-colors">
              <div className="w-10 h-10 mb-6 flex items-center justify-center bg-cyan-500/10 rounded text-cyan-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3">Behavioral Analysis</h3>
              <p className="text-[#8A93A3] text-sm leading-relaxed">
                Track completion rates and drop-off points to precisely
                understand when and why you stop watching certain genres.
              </p>
            </div>

            <div className="bg-[#0E1622] p-8 rounded-xl border border-white/5 hover:border-cyan-500/20 transition-colors">
              <div className="w-10 h-10 mb-6 flex items-center justify-center bg-cyan-500/10 rounded text-cyan-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3">
                Explainable Recommendations
              </h3>
              <p className="text-[#8A93A3] text-sm leading-relaxed">
                No more black boxes. Every recommendation explains exactly why
                it was chosen based on your past watch history.
              </p>
            </div>

            <div className="bg-[#0E1622] p-8 rounded-xl border border-white/5 hover:border-cyan-500/20 transition-colors">
              <div className="w-10 h-10 mb-6 flex items-center justify-center bg-cyan-500/10 rounded text-cyan-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3">Intelligent Tracking</h3>
              <p className="text-[#8A93A3] text-sm leading-relaxed">
                Log titles across multiple OTT platforms to build a
                comprehensive global pattern of your media consumption.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-white/5 bg-[#0e1622]/30">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-serif font-light mb-4">The Process</h2>
          <p className="text-[#8A93A3]">
            A deliberate pipeline for viewing intelligence.
          </p>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 justify-between">
          <div className="flex-1 text-center md:text-left">
            <div className="text-5xl font-serif font-light text-cyan-500/40 mb-4">
              01
            </div>
            <h4 className="text-xl font-medium mb-2">Log Content</h4>
            <p className="text-[#8A93A3] text-sm leading-relaxed">
              Track movies and shows as you watch, marking completions and
              drop-offs to feed the engine.
            </p>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-5xl font-serif font-light text-cyan-500/40 mb-4">
              02
            </div>
            <h4 className="text-xl font-medium mb-2">Process Traits</h4>
            <p className="text-[#8A93A3] text-sm leading-relaxed">
              Our AI compiles pacing, genre clusters, and narrative traits to
              formulate your unique viewing profile.
            </p>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-5xl font-serif font-light text-cyan-500/40 mb-4">
              03
            </div>
            <h4 className="text-xl font-medium mb-2">Extract Insights</h4>
            <p className="text-[#8A93A3] text-sm leading-relaxed">
              Receive transparent explanations for future recommendations based
              exclusively on mapped criteria.
            </p>
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-cyan-500 text-sm font-medium tracking-wider uppercase mb-2 block">
              System Transparency
            </span>
            <h2 className="text-4xl font-serif font-light mb-6 leading-tight">
              We show you
              <br />
              the algorithm.
            </h2>
            <p className="text-[#8A93A3] text-lg leading-relaxed mb-6">
              When CineMind suggests a title, you receive an insight card. It
              breaks down the narrative components, pacing elements, and
              directorial overlaps that triggered the recommendation.
            </p>
            <p className="text-[#8A93A3] text-lg leading-relaxed">
              No black-box feeding. Total analytical clarity.
            </p>
          </div>

          <div className="bg-[#0E1622] rounded-xl p-8 border border-white/5 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 rounded-l-xl"></div>
            <div className="flex items-center gap-2 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wide">
                Analysis Output
              </span>
            </div>

            <h3 className="text-xl font-serif mb-4">Dune: Part Two</h3>

            <div className="space-y-4">
              <div className="border-l-2 border-white/10 pl-4 py-1">
                <p className="text-sm font-medium text-[#E6EAF0]">
                  Narrative Match: 92%
                </p>
                <p className="text-xs text-[#8A93A3] mt-1">
                  Aligns with your high completion rate for sweeping sci-fi
                  epics.
                </p>
              </div>
              <div className="border-l-2 border-white/10 pl-4 py-1">
                <p className="text-sm font-medium text-[#E6EAF0]">
                  Pacing Tolerance
                </p>
                <p className="text-xs text-[#8A93A3] mt-1">
                  You rarely drop slow-burn films directed by Denis Villeneuve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 text-center border-t border-white/5 bg-[#0e1622]/20">
        <h2 className="text-4xl font-serif font-light mb-8">
          Ready to map your catalog?
        </h2>
        <button
          onClick={() => navigate("/login")}
          className="border border-white/20 px-8 py-3.5 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
        >
          Initialize Dashboard
        </button>
      </section>

      <footer className="py-8 border-t border-white/5 text-center text-[#8A93A3] text-xs">
        <p>
          © {new Date().getFullYear()} CineMind AI. Analytical media engine.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
