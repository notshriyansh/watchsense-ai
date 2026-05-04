import type { WatchProgress } from "./watchTypes";

export const buildExplainRecommendationPrompt = ({
  recommendedTitle,
  overview,
  watchHistory,
  localExplanation,
}: {
  recommendedTitle: string;
  overview: string;
  watchHistory: WatchProgress[];
  localExplanation: string;
}) => {
  const historySummary = watchHistory.map((w) => ({
    title: w.title,
    progress: w.progressPercent,
    status: w.status,
  }));

  return `
You are an AI recommendation system.

User watch history:
${JSON.stringify(historySummary, null, 2)}

Recommended title:
"${recommendedTitle}"

Overview:
${overview}

Local retrieval explanation:
${localExplanation}

Explain WHY this title fits the user's taste.
Use the local retrieval explanation and mention patterns from watch history.
2–3 lines max.
No emojis.
No hype.
Clear and honest.
`;
};
