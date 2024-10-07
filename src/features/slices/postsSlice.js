import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    isLoading: true,
    arePostsAvailable: false
}

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        
        fetchPosts: (state, action) => {
            state.posts = action.payload
        },

        addPost: (state, action) => {

            if (state.posts.length === 0) {
                state.arePostsAvailable = true
            }

            state.posts = [...state.posts, action.payload]
        },

        updatePost: (state, action) => {
            state.posts = state.posts.map(post => (
                post.postID === action.payload.postID ? action.payload : post
            ))
        },

        deletePost: (state, action) => {
            state.posts = state.posts.filter(post => post.postID !== action.payload._id)

            if (state.posts.length === 0) {
                state.arePostsAvailable = false
            }
        },

        emptyPosts: (state) => {
            state.posts = []
        },

        toggleLoading: (state, action) => {
            state.isLoading = action.payload
        },

        togglePostsAvailability: (state, action) => {
            state.arePostsAvailable = action.payload
        }
    }
})

export const { fetchPosts, emptyPosts, toggleLoading, togglePostsAvailability, addPost, updatePost, deletePost } = postsSlice.actions
export default postsSlice.reducer