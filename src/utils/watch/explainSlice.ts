import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generateGeminiText } from "../geminiClient";
import { buildExplainRecommendationPrompt } from "./explainPrompts";
import type { WatchProgress } from "./watchTypes";

export const fetchExplainRecommendation = createAsyncThunk<
  { movieId: number; explanation: string },
  {
    movieId: number;
    title: string;
    overview: string;
    watchHistory: WatchProgress[];
  }
>("explain/fetch", async ({ movieId, title, overview, watchHistory }) => {
  const prompt = buildExplainRecommendationPrompt({
    recommendedTitle: title,
    overview,
    watchHistory,
  });

  const response = await generateGeminiText(prompt);

  return {
    movieId,
    explanation: response,
  };
});

interface ExplainState {
  explanations: Record<number, string>;
}

const initialState: ExplainState = {
  explanations: {},
};

const explainSlice = createSlice({
  name: "explain",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchExplainRecommendation.fulfilled, (state, action) => {
      state.explanations[action.payload.movieId] = action.payload.explanation;
    });
  },
});

export default explainSlice.reducer;
