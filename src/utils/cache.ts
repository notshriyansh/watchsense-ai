const CACHE_KEY = "cinemind_llm_cache";

const readCache = (): Record<string, { value: unknown; timestamp: number }> => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
};

export const getCachedValue = <T>(key: string): T | null => {
  const cache = readCache();
  const entry = cache[key];

  if (!entry) return null;

  const TTL = 1000 * 60 * 60 * 24;

  if (Date.now() - entry.timestamp > TTL) {
    delete cache[key];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    return null;
  }

  return entry.value as T;
};

export const setCachedValue = <T>(key: string, value: T) => {
  const cache = readCache();

  cache[key] = {
    value,
    timestamp: Date.now(),
  };

  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};
