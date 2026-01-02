import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { WatchProgress } from "./watchTypes";
import { buildProfilePrompt } from "./profilePrompts";
import { generateGeminiText } from "../geminiClient";

export const fetchWatchingProfile = createAsyncThunk<string, WatchProgress[]>(
  "profile/fetchWatchingProfile",
  async (watchHistory) => {
    const prompt = buildProfilePrompt(watchHistory);
    const response = await generateGeminiText(prompt);
    return response;
  }
);

interface ProfileState {
  profileText: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: ProfileState = {
  profileText: null,
  status: "idle",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchingProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWatchingProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profileText = action.payload;
      })
      .addCase(fetchWatchingProfile.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default profileSlice.reducer;
