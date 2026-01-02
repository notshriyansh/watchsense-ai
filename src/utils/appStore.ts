import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../utils/userSlice";
import movieReducer from "../utils/movieSlice";
import gptReducer from "../utils/gptSlice";
import watchReducer from "./watch/watchSlice";
import insightsReducer from "./watch/insightsSlice";
import profileReducer from "./watch/profileSlice";
import explainReducer from "./watch/explainSlice";
import importReducer from "./watch/importSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    movies: movieReducer,
    gpt: gptReducer,
    watch: watchReducer,
    insights: insightsReducer,
    profile: profileReducer,
    explain: explainReducer,
    import: importReducer,
  },
});

export default appStore;
export type AppDispatch = typeof appStore.dispatch;
export type RootState = ReturnType<typeof appStore.getState>;
