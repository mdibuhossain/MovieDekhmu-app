import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import formDataReducer from "./slices/formDataSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    formData: formDataReducer,
  },
});
