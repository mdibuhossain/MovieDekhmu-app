import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movie: {
    title: "",
    year: "",
    origin: "",
    filmType: "",
    subType: "",
    review: "",
  },
  filter: {
    title: "",
    review: "",
    origin: "",
    year: "",
    filmType: "",
    subType: "",
  },
  isLoading: false,
};

const formSlice = createSlice({
  name: "formData",
  initialState,
  reducers: {
    setForm(state, action) {
      state[action.payload.index][action.payload.key] = action.payload
        ? action.payload.value
        : "";
    },
    resetMovieForm(state, action) {
      state.movie = initialState.movie;
    },
    resetFilterForm(state, action) {
      state.filter = initialState.filter;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { setForm, resetMovieForm, resetFilterForm, setLoading } =
  formSlice.actions;
export default formSlice.reducer;
