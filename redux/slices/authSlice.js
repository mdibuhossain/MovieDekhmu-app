import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  trigger: false,
  isLoading: true,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setTrigger(state, action) {
      state.trigger = action.payload;
    },
    setLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setUser, setLoading, setTrigger, setLoggedIn } =
  authSlice.actions;
export default authSlice.reducer;
