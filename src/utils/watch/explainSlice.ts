import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generateGeminiText } from "../geminiClient";
import { getCachedValue, setCachedValue } from "../cache";
import { getMovieFeatures } from "../recommendationEngine";
import { buildExplainRecommendationPrompt } from "./explainPrompts";
import type { WatchProgress } from "./watchTypes";

const buildLocalExplanation = ({
  title,
  overview,
  genreIds = [],
  watchHistory,
}: {
  title: string;
  overview: string;
  genreIds?: number[];
  watchHistory: WatchProgress[];
}) => {
  const completed = watchHistory.filter((item) => item.status === "completed");
  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

  const recentCompleted = completed.filter(
    (item) => item.lastWatchedAt > now - THIRTY_DAYS,
  );

  const features = getMovieFeatures({ genre_ids: genreIds, overview });

  let explanation = `${title} is recommended because `;

  if (recentCompleted.length > 0) {
    const recentTitles = recentCompleted
      .slice(-2)
      .map((item) => item.title)
      .join(" and ");
    explanation += `you recently watched ${recentTitles}, and this shares similar themes. `;
  } else if (completed.length > 0) {
    explanation += `it matches patterns from your completed watches. `;
  } else {
    explanation += `it provides a good starting point to learn your taste preferences. `;
  }

  if (features.length > 0) {
    explanation += `Key signals include ${features.slice(0, 2).join(" and ")}. `;
  }

  if (completed.length > 0) {
    const completionRate =
      watchHistory.length > 0 ? completed.length / watchHistory.length : 0;
    if (completionRate > 0.7) {
      explanation += `You tend to complete movies in this style.`;
    } else {
      explanation += `This is slightly different from your usual picks to encourage exploration.`;
    }
  }

  return explanation;
};

const buildHistoryFingerprint = (watchHistory: WatchProgress[]) =>
  watchHistory
    .map((item) => `${item.movieId}:${item.status}:${item.progressPercent}`)
    .join("|");

export const fetchExplainRecommendation = createAsyncThunk<
  { movieId: number; explanation: string },
  {
    movieId: number;
    title: string;
    overview: string;
    genreIds?: number[];
    watchHistory: WatchProgress[];
  }
>(
  "explain/fetch",
  async ({ movieId, title, overview, genreIds, watchHistory }) => {
    const cacheKey = `explain:${movieId}:${buildHistoryFingerprint(
      watchHistory,
    )}`;
    const cached = getCachedValue<string>(cacheKey);

    if (cached) {
      return {
        movieId,
        explanation: cached,
      };
    }

    const localExplanation = buildLocalExplanation({
      title,
      overview,
      genreIds,
      watchHistory,
    });

    const prompt = buildExplainRecommendationPrompt({
      recommendedTitle: title,
      overview,
      watchHistory,
      localExplanation,
    });

    let explanation = localExplanation;

    const shouldRefine = localExplanation.length < 120;

    if (shouldRefine) {
      try {
        const response = await generateGeminiText(prompt);
        explanation = response.trim() || localExplanation;
      } catch {
        explanation = localExplanation;
      }
    }

    setCachedValue(cacheKey, explanation);

    return {
      movieId,
      explanation,
    };
  },
);

interface ExplainState {
  explanations: Record<number, string>;
  loadingIds: Record<number, boolean>;
}

const initialState: ExplainState = {
  explanations: {},
  loadingIds: {},
};

const explainSlice = createSlice({
  name: "explain",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExplainRecommendation.pending, (state, action) => {
        state.loadingIds[action.meta.arg.movieId] = true;
      })
      .addCase(fetchExplainRecommendation.fulfilled, (state, action) => {
        state.loadingIds[action.payload.movieId] = false;
        state.explanations[action.payload.movieId] = action.payload.explanation;
      })
      .addCase(fetchExplainRecommendation.rejected, (state, action) => {
        if (action.meta.arg?.movieId !== undefined) {
          state.loadingIds[action.meta.arg.movieId] = false;
        }
      });
  },
});

export default explainSlice.reducer;
