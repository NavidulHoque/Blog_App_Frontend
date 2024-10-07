import { configureStore } from "@reduxjs/toolkit";
import userLoginSlice from "./slices/userLoginSlice";
import postsSlice from "./slices/postsSlice";

export const store = configureStore({
    reducer: {
        UserLogin: userLoginSlice,
        posts: postsSlice
    }
})