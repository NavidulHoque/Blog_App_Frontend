import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem("userOfBlogApp")) || null
}

const userLoginSlice = createSlice({
    name: "UserLogin",
    initialState,
    reducers:{
        LogIn: (state, action) => {
            state.user = action.payload
            localStorage.setItem("userOfBlogApp", JSON.stringify(state.user))
        },

        LogOut: (state) => {
            state.user = null
            localStorage.setItem("userOfBlogApp", JSON.stringify(state.user))
        }
    }
})

export const { LogIn, LogOut } = userLoginSlice.actions
export default userLoginSlice.reducer