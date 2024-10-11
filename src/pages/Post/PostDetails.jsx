/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Category from "../../components/post/postDetails/Category";
import Comment from "../../components/post/postDetails/Comment";
import Button from "../../components/post/common/Button"
import { useEffect, useRef, useState } from "react"
import { url } from "../../url";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import { LogOut } from "../../features/slices/userLoginSlice";
import { createPortal } from "react-dom";
import DeleteConfirmationMessage from "../../components/post/common/DeleteConfirmationMessage";
import autoResizeTextarea from "../../functions/autoResizeTextArea";
import errorToast from "../../functions/errorToast";
import socket from "../../socket";
import successToast from "../../functions/successToast";
import { ColorRing } from "react-loader-spinner";
import { getStorage, ref, deleteObject } from "firebase/storage";
import Image from "../../components/post/common/Image";
import CategoriesDiv from "../../components/post/common/CategoriesDiv";


const PostDetails = () => {
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [writeComment, setWriteComment] = useState("")
    const [openConfirmationMessage, setOpenConfirmationMessage] = useState(false)
    const [loadingAddComment, setLoadingAddComment] = useState(false)
    const [loadingDeletePost, setLoadingDeletePost] = useState(false)
    const [updatedComment, setUpdatedComment] = useState({})

    const scrollRef = useRef(null)
    const textareaRef = useRef(null);
    const { postID } = useParams()
    const user = useSelector(state => state.UserLogin.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isPostBelongsToLoggedInUser = (post?.userInfo?.userID === user.id)
    const storage = getStorage();


    //fetching the post
    useEffect(() => {

        async function getPost() {

            try {
                const response = await axios.get(url + `/post/getPostByID/${postID}`, {
                    withCredentials: true
                })

                if (response.data.status) {
                    setPost(response.data.post)
                }

                else {
                    throw new Error(response.data.message)
                }
            }

            catch (error) {
                errorToast(error.message)

                if (error.message.toLowerCase().includes("token")) {

                    dispatch(LogOut())
                    navigate("/login")
                }
            }
        }

        getPost()

    }, [postID, dispatch, navigate])


    //fetching all comments
    useEffect(() => {

        async function getComments() {

            try {
                const response = await axios.get(url + `/comment/${postID}`, {
                    withCredentials: true
                })

                if (response.data.status) {
                    setComments(response.data.comments)
                }

                else {

                    if (!response.data.message.toLowerCase().includes("token")) {

                        toast.error(response.data.message, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                            transition: Bounce,
                        })

                    }
                }
            }

            catch {
                toast.error("Something went wrong, please reload the page", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                })
            }
        }

        getComments()

    }, [postID, dispatch, navigate])


    useEffect(() => {

        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }

    }, [scrollRef.current])


    //listening to real time communication
    useEffect(() => {

        socket.on('newComment', (commentData) => {

            setComments(prevComments => [...prevComments, commentData]);
        })

        socket.on('updateComment', (updatedCommentData) => {
            setUpdatedComment(updatedCommentData)

            return setComments(prevComments => prevComments.map(prevComment => (
                prevComment.commentID === updatedCommentData.commentID ? updatedCommentData : prevComment
            )))
        })

        socket.on('deleteComment', (commentID) => {

            setComments(prevComments => prevComments.filter(prevComment => prevComment.commentID !== commentID))
        });

        return () => {
            socket.off('newComment')
            socket.off('updateComment')
            socket.off('deleteComment')
        }

    }, [])


    const handleAddComment = async () => {

        if (writeComment) {

            setLoadingAddComment(true)
            try {
                const response = await axios.post(url + "/comment/create", {
                    comment: writeComment,
                    postID,
                    userID: user.id
                }, {
                    withCredentials: true
                })

                if (response.data.status) {
                    setWriteComment("")
                    setLoadingAddComment(false)
                }

                else {
                    throw new Error(response.data.message);
                }
            }

            catch (error) {
                errorToast(error)
                setLoadingAddComment(false)

                if (error.message.toLowerCase().includes("token")) {

                    dispatch(LogOut())
                    navigate("/login")
                }
            }
        }

        else {
            errorToast("Please write something to comment")
        }
    }

    const handleDeletePost = async () => {

        setLoadingDeletePost(true)

        try {
            const response = await axios.delete(url + `/post/${postID}`, { withCredentials: true })

            if (response.data.status) {

                const storageRef = ref(storage, response.data.photoURL)

                deleteObject(storageRef)
                    .then(() => {

                        setLoadingDeletePost(false)

                        successToast(response.data.message)

                        navigate("/")

                    })
                    .catch((error) => {

                        setLoadingDeletePost(false)

                        successToast(response.data.message)

                        navigate("/")
                    })
            }

            else {
                throw new Error(response.data.message)
            }
        }

        catch (error) {
            errorToast(error.message)
            setLoadingDeletePost(false)

            if (error.message.toLowerCase().includes("token")) {

                dispatch(LogOut())
                navigate("/login")
            }
        }
    }

    return (

        <>

            <div ref={scrollRef} className="min-h-[72vh] flex justify-center py-6">

                {post ? (
                    <div className="xl:w-[85vw] w-[90vw] mx-auto">

                        <div className="flex flex-col gap-y-5">

                            <div className="flex justify-between items-center gap-x-3">

                                <h1 className="text-[36px] font-semibold sm:text-left text-center">{post?.title}</h1>

                                {isPostBelongsToLoggedInUser && (

                                    <div className="flex gap-x-2">

                                        <FaRegEdit
                                            className="w-[25px] h-[25px] cursor-pointer"
                                            onClick={() => navigate(`/edit/${postID}`)}
                                        />
                                        <MdDelete
                                            onClick={() => setOpenConfirmationMessage(true)}
                                            className="w-[25px] h-[25px] cursor-pointer"
                                        />

                                    </div>
                                )}

                            </div>

                            <div className="flex justify-between items-center font-medium text-green-600">

                                <span>{post?.userInfo?.username}</span>

                                <div className="space-x-2">

                                    <span>{new Date(post?.updatedAt).toLocaleDateString() + ","}</span>

                                    <span>{new Date(post?.updatedAt).toLocaleTimeString()}</span>

                                </div>

                            </div>

                            <Image
                                imageURL={post?.photoURL}
                                extraStyle="w-full md:h-[700px] sm:h-[400px] h-[300px]"
                            />

                            <p>{post?.description}</p>

                            {/* Categories */}
                            <div className="flex items-center space-x-3">

                                <h2 className="font-semibold self-start lg:self-center">Categories:</h2>

                                <CategoriesDiv>

                                    {post?.categories?.map(category => (
                                        <Category key={category._id} label={category.name} />
                                    ))}

                                </CategoriesDiv>

                            </div>

                            {/* Comments */}
                            <div className="flex flex-col gap-y-3">

                                <h2 className="font-semibold">Comments: </h2>

                                {comments?.map(comment => (

                                    <Comment
                                        key={comment?.commentID}
                                        comment={comment}
                                        user={user}
                                        isPostBelongsToLoggedInUser={isPostBelongsToLoggedInUser}
                                        updatedComment={updatedComment}
                                    />
                                ))}

                            </div>

                            {/* Write a comment */}

                            <div className="flex space-x-2">

                                <textarea
                                    ref={textareaRef}
                                    type="text"
                                    placeholder="Write a comment"
                                    className="w-full p-4 border-[2px] border-black rounded-lg outline-none resize-none break-words whitespace-normal"
                                    onChange={(e) => {
                                        setWriteComment(e.target.value)
                                        autoResizeTextarea(textareaRef)
                                    }}
                                    value={writeComment}
                                    rows="1"
                                />

                                <Button
                                    label="Add Comment"
                                    extraStyle="px-4 h-[70px]"
                                    handleClick={handleAddComment}
                                    loading={loadingAddComment}
                                />

                            </div>

                        </div>

                    </div>
                ) : (
                    <ColorRing
                        visible={true}
                        height="100"
                        width="100"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                    />
                )}

            </div>

            {openConfirmationMessage &&
                createPortal(
                    <DeleteConfirmationMessage
                        setOpen={setOpenConfirmationMessage}
                        handleDelete={handleDeletePost}
                        loading={loadingDeletePost}
                    />, document.body)}
        </>
    )
}

export default PostDetails
