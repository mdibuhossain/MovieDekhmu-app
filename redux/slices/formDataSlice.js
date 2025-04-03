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
  isEdit: false,
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
    setMovie(state, action) {
      state.movie = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
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
    setIsEdit(state, action) {
      state.isEdit = action.payload;
    },
  },
});

export const {
  setForm,
  setMovie,
  setFilter,
  resetMovieForm,
  resetFilterForm,
  setLoading,
  setIsEdit,
} = formSlice.actions;
export default formSlice.reducer;
