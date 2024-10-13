import { useDispatch, useSelector } from "react-redux"
import BlogPost from "../../components/home/BlogPost"
import Heading from "../../components/post/common/Heading"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"
import { url } from "../../url"
import { emptyPosts, fetchPosts, toggleLoading, togglePostsAvailability } from "../../features/slices/postsSlice"
import { ColorRing } from "react-loader-spinner"
import errorToast from "../../functions/errorToast"
import { Helmet } from "react-helmet-async"

const MyPosts = () => {
    const posts = useSelector(state => state.posts.posts)
    const isLoading = useSelector(state => state.posts.isLoading)
    const arePostsAvailable = useSelector(state => state.posts.arePostsAvailable)
    const user = useSelector(state => state.UserLogin.user)
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {

        async function getAllLoggedInUserPosts() {

            try {
                let response

                if (location.search) {

                    response = await axios.get(url + `/post/posts/${user.id + location.search}`, { withCredentials: true })
                }

                else {
                    response = await axios.get(url + `/post/posts/${user.id}`, { withCredentials: true })
                }

                if (response.data.status) {
                    dispatch(fetchPosts(response.data.posts))
                    dispatch(toggleLoading(false))
                    dispatch(togglePostsAvailability(true))
                }

                else {
                    throw new Error(response.data.message);
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

        getAllLoggedInUserPosts()

    }, [dispatch, location.search, user.id])


    const handleTraverse = () => {
        navigate("/myPosts")
        //rest of the post fetching will be conducted by the useEffect hook
    }

    return (
        <>
            <Helmet>
                <title>My Posts</title>
            </Helmet>

            <div className="min-h-[72vh] py-6">

                <div className="xl:w-[85vw] w-[90vw] mx-auto flex flex-col justify-center items-center gap-y-10">

                    <Heading
                        label="My Posts:"
                        extraStyle="self-start cursor-pointer"
                        handleClick={handleTraverse}
                    />

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
        </>
    )
}

export default MyPosts
