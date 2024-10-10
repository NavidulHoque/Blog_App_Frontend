/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"
import BlogPost from "../../components/home/BlogPost"
import { url } from './../../url';
import { useDispatch, useSelector } from "react-redux";
import { addPost, deletePost, emptyPosts, fetchPosts, toggleLoading, togglePostsAvailability, updatePost } from "../../features/slices/postsSlice";
import axios from "axios";
import { ColorRing } from 'react-loader-spinner'
import { useLocation } from "react-router-dom";
import errorToast from "../../functions/errorToast";
import socket from "../../socket";

const Home = () => {
  const dispatch = useDispatch()
  const posts = useSelector(state => state.posts.posts)
  const isLoading = useSelector(state => state.posts.isLoading)
  const arePostsAvailable = useSelector(state => state.posts.arePostsAvailable)
  const location = useLocation()

  //fetching all posts
  useEffect(() => {

    async function getAllPosts() {

      try {
        let response

        if (location.search) {
          response = await axios.get(url + `/post/readAllPosts${location.search}`)
        }

        else {
          response = await axios.get(url + "/post/readAllPosts")
        }

        if (response.data.status) {
          dispatch(fetchPosts(response.data.posts))
          dispatch(toggleLoading(false))
          dispatch(togglePostsAvailability(true))
        }

        else {
          throw new Error(response.data.message)
        }
      }

      catch (error) {
        dispatch(emptyPosts())
        dispatch(toggleLoading(false))
        dispatch(togglePostsAvailability(false))

        if (error.message) {
          errorToast(error.message)
        }
      }
    }

    getAllPosts()

  }, [dispatch, location.search])


  //listening real time communication
  useEffect(() => {

    socket.on('newPost', (post) => {

      dispatch(addPost(post))
    })

    socket.on('updatePost', (post) => {

      dispatch(updatePost(post))
    })

    socket.on('deletePost', (deletedPost) => {

      dispatch(deletePost(deletedPost))
    })

    return () => {
      socket.off('newPost')
      socket.off('updatePost')
      socket.off('deletePost')
    }
  }, [])


  return (
    <div className="min-h-[72vh] py-6">

      <div className="xl:w-[85vw] w-[90vw] mx-auto flex flex-col justify-center items-center space-y-10">

        {isLoading ? (
          <ColorRing
            visible={true}
            height="100"
            width="100"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
        )
          :
          arePostsAvailable ? posts.map(post => (
            <BlogPost key={post.postID} post={post} />
          )) : (
            <h1 className="pt-5 text-[30px]">No Posts Found</h1>
          )
        }

      </div>

    </div>
  )
}

export default Home
