const RECOMMENDATION_HISTORY_KEY = "cinemind_recommendation_history";
const MAX_HISTORY_SIZE = 20;

export interface RecommendationHistoryItem {
  movieId: number;
  recommendedAt: number;
}

export const loadRecommendationHistory = (): RecommendationHistoryItem[] => {
  try {
    const data = localStorage.getItem(RECOMMENDATION_HISTORY_KEY);
    const parsed = data ? JSON.parse(data) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is RecommendationHistoryItem =>
        item &&
        typeof item.movieId === "number" &&
        typeof item.recommendedAt === "number",
    );
  } catch {
    return [];
  }
};

export const saveRecommendationHistory = (
  history: RecommendationHistoryItem[],
) => {
  try {
    const trimmedHistory = history.slice(-MAX_HISTORY_SIZE);
    localStorage.setItem(
      RECOMMENDATION_HISTORY_KEY,
      JSON.stringify(trimmedHistory),
    );
  } catch {}
};

export const addToRecommendationHistory = (movieId: number) => {
  const history = loadRecommendationHistory();
  const filtered = history.filter((item) => item.movieId !== movieId);
  filtered.push({ movieId, recommendedAt: Date.now() });
  saveRecommendationHistory(filtered);
};

export const getRecentRecommendationIds = (limit: number = 10): number[] => {
  const history = loadRecommendationHistory();
  return history.slice(-limit).map((item) => item.movieId);
};
