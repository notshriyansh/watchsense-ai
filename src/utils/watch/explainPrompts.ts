import type { WatchProgress } from "./watchTypes";

export const buildExplainRecommendationPrompt = ({
  recommendedTitle,
  overview,
  watchHistory,
}: {
  recommendedTitle: string;
  overview: string;
  watchHistory: WatchProgress[];
}) => {
  const historySummary = watchHistory.map((w) => ({
    title: w.title,
    progress: w.progressPercent,
  }));

  return `
You are an AI recommendation system.

User watch history:
${JSON.stringify(historySummary, null, 2)}

Recommended title:
"${recommendedTitle}"

Overview:
${overview}

Explain WHY this title fits the user's taste.
Mention patterns from their watch history.
2–3 lines max.
No emojis.
No hype.
Clear and honest.
`;
};
