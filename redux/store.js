import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import formDataReducer from "./slices/formDataSlice";
import dataReducer from "./slices/dataSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    formData: formDataReducer,
    data: dataReducer,
  },
});
