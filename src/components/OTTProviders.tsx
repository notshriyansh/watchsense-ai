import { useEffect, useState } from "react";
import { fetchWatchProviders } from "../utils/tmdbClient";

type Provider = {
  provider_name: string;
};

const OTTProviders = ({ movieId }: { movieId: number }) => {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    fetchWatchProviders(movieId).then(setProviders);
  }, [movieId]);

  if (!providers.length) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1 justify-center">
      {providers.slice(0, 3).map((p) => (
        <span
          key={p.provider_name}
          className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-white"
        >
          {p.provider_name}
        </span>
      ))}
    </div>
  );
};

export default OTTProviders;
