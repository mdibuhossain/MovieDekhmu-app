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
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { setForm, setLoading } = formSlice.actions;
export default formSlice.reducer;
