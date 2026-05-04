const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0B0F14]/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white">CineMind AI</h3>
            <p className="text-sm text-gray-400 mt-2 max-w-xs">
              Personalized movie recommendations powered by behavioral
              intelligence and explainable AI.
            </p>
          </div>

          <div className="flex gap-10">
            <div>
              <p className="text-sm font-medium text-gray-300 mb-3">Product</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white transition cursor-pointer">
                  Browse
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Watchlist
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Dashboard
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-300 mb-3">Connect</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="https://github.com/notshriyansh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:shriyansh707@gmail.com"
                    className="hover:text-white transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CineMind AI. All rights reserved.</p>
          <p>
            Built by{" "}
            <span className="text-gray-300 font-medium">Shriyansh Sharma</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
