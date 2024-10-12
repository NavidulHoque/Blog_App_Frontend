/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createPortal } from "react-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DeleteConfirmationMessage from "../common/DeleteConfirmationMessage";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { url } from "../../../url";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut } from "../../../features/slices/userLoginSlice";
import { FaRegSave } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import autoResizeTextarea from "../../../functions/autoResizeTextArea";
import { MdOutlineCancel } from "react-icons/md";
import errorToast from "../../../functions/errorToast";

const Comment = ({
  comment,
  user,
  isPostBelongsToLoggedInUser,
  updatedComment
}) => {

  const [loadingDelete, setLoadingDelete] = useState(false)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [open, setOpen] = useState(false)
  const [editComment, setEditComment] = useState(comment?.comment)
  const [isUpdating, setIsUpdating] = useState(false)
  const [textareaHeight, setTextareaHeight] = useState("0px")

  const isCommentBelongsToLoggedInUser = (comment?.userInfo?.userID === user.id)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const textareaRef = useRef(null)

  useEffect(() => {

    if (updatedComment.commentID === comment?.commentID) {
      setEditComment(updatedComment.comment)
    }

  }, [updatedComment])

  useEffect(() => {

    setTextareaHeight(`${textareaRef.current.scrollHeight}px`) 
    
  }, [])
  

  const handleDeleteComment = async () => {
    setLoadingDelete(true)

    try {
      const response = await axios.delete(url + `/comment/${comment.commentID}`, { withCredentials: true })


      if (response.data.status) {
        setLoadingDelete(false)
        setOpen(false)
      }

      else {
        throw new Error(response.data.message)
      }
    }

    catch (error) {

      setLoadingDelete(false)
      errorToast(error.message)

      if (error.message.toLowerCase().includes("token")) {

        dispatch(LogOut())
        navigate("/login")
      }
    }
  }

  const handleUpdateComment = async () => {
    setIsUpdating(false)
    setLoadingUpdate(true)

    try {
      const response = await axios.put(url + `/comment/${comment?.commentID}`, {
        comment: editComment
      }, {
        withCredentials: true
      })

      if (response.data.status) {
        setLoadingUpdate(false)
      }

      else {
        throw new Error(response.data.message)
      }
    }

    catch (error) {
      setLoadingUpdate(false)
      errorToast(error.message)

      if (error.message.toLowerCase().includes("token")) {

        dispatch(LogOut())
        navigate("/login")
      }
    }
  }

  return (
    <>
      <div className="bg-gray-200 flex flex-col gap-y-2 rounded-lg p-4">

        <div className="flex sm:flex-row flex-col sm:justify-between items-center">

          <p className="font-semibold text-slate-600 self-start">{comment?.userInfo?.username}</p>

          <div className="flex items-center sm:justify-center justify-between sm:w-auto w-full gap-x-3">

            <div className="flex gap-x-3">

              <span className="text-slate-600">{new Date(comment?.updatedAt).toLocaleDateString() + ","}</span>

              <span className="text-slate-600">{new Date(comment?.updatedAt).toLocaleTimeString()}</span>

            </div>

            <div className="flex gap-x-3">

              {isCommentBelongsToLoggedInUser ? (
                <>
                  {isUpdating ? (
                    <>
                      <FaRegSave
                        className="w-[20px] h-[20px] cursor-pointer"
                        onClick={handleUpdateComment}
                      />

                      <MdOutlineCancel
                        className="w-[20px] h-[20px] cursor-pointer"
                        onClick={() => {
                          setIsUpdating(false)
                          setEditComment(comment?.comment)
                        }}
                      />
                    </>

                  ) : loadingUpdate ? (

                    <BeatLoader color="#000" size={10} />

                  ) : (

                    <FaRegEdit
                      className="w-[20px] h-[20px] cursor-pointer"
                      onClick={() => {
                        setIsUpdating(true)
                        autoResizeTextarea(textareaRef)
                        textareaRef.current.focus()
                      }}
                    />

                  )}

                  <MdDelete
                    className="w-[20px] h-[20px] cursor-pointer"
                    onClick={() => setOpen(true)}
                  />
                </>
              ) : isPostBelongsToLoggedInUser ? (

                <MdDelete
                  className="w-[20px] h-[20px] cursor-pointer"
                  onClick={() => setOpen(true)}
                />

              ) : ""}
            </div>

          </div>

        </div>

        <textarea
          ref={textareaRef}
          type="text"
          value={editComment}
          onChange={(e) => {
            setEditComment(e.target.value)
            autoResizeTextarea(textareaRef)
          }}
          style={{height: `${textareaHeight}`}}
          className={`${isUpdating ? "bg-white px-2" : "bg-gray-200"} outline-none resize-none break-all whitespace-normal overflow-hidden`}
          readOnly={!isUpdating}
          rows="1"
        />

      </div>

      {open &&
        createPortal(
          <DeleteConfirmationMessage
            setOpen={setOpen}
            handleDelete={handleDeleteComment}
            loading={loadingDelete}
          />, document.body)}
    </>
  )
}

export default Comment
