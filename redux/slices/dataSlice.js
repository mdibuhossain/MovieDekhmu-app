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
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { setDataByIndex, setLoading } = dataSlice.actions;
export default dataSlice.reducer;
