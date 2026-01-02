import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Movie } from "../utils/types";

const myListSlice = createSlice({
  name: "myList",
  initialState: [] as Movie[],
  reducers: {
    addToMyList: (state, action: PayloadAction<Movie>) => {
      state.push(action.payload);
    },
    removeFromMyList: (state, action: PayloadAction<number>) => {
      return state.filter((m) => m.id !== action.payload);
    },
  },
});

export const { addToMyList, removeFromMyList } = myListSlice.actions;
export default myListSlice.reducer;
