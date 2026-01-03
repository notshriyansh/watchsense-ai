import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import movieReducer from "./movieSlice";
import gptReducer from "./gptSlice";
import watchReducer from "./watch/watchSlice";
import insightsReducer from "./watch/insightsSlice";
import profileReducer from "./watch/profileSlice";
import explainReducer from "./watch/explainSlice";
import importReducer from "./watch/importSlice";
import myListReducer from "./myListSlice";

export const appStore = configureStore({
  reducer: {
    user: userReducer,
    movies: movieReducer,
    gpt: gptReducer,
    watch: watchReducer,
    insights: insightsReducer,
    profile: profileReducer,
    explain: explainReducer,
    import: importReducer,
    myList: myListReducer,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
