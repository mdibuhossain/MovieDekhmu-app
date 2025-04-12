import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movies: [],
  isLoading: true,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setDataByIndex(state, action) {
      state[action.payload.index] = action.payload.value;
    },
    clearMovies(state) {
      state.movies = [];
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { clearMovies, setDataByIndex, setLoading } = dataSlice.actions;
export default dataSlice.reducer;
