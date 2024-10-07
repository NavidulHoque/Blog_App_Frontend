import Heading from "../../components/post/common/Heading"
import Button from "../../components/post/common/Button"
import Input from "../../components/post/common/Input"
import CreatedCategories from "../../components/post/createPost/CreatedCategories"
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LogOut } from "../../features/slices/userLoginSlice";
import axios from 'axios';
import { imageFolder, url } from './../../url';
import errorToast from "../../functions/errorToast";
import updatePostReq from "../../functions/updatePostReq";

const EditPost = () => {

  const [currentImage, setCurrentImage] = useState(null)

  const [updatedImageFile, setUpdatedImageFile] = useState(null)

  const [imageURL, setImageURL] = useState(null)

  const [title, setTitle] = useState("")

  const [description, setDescription] = useState("")

  const [inputCategory, setInputCategory] = useState("")

  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(false)

  const fileRef = useRef(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { postID } = useParams()


  //generate url to show photo temporarily
  useEffect(() => {

    if (updatedImageFile?.type?.startsWith("image")) {

      const url = URL.createObjectURL(updatedImageFile)
      setImageURL(url)

      return () => URL.revokeObjectURL(url)
    }

    else if (!updatedImageFile?.type?.startsWith("image") && updatedImageFile) {

      errorToast("Invalid file type. Only images are allowed.")
    }

  }, [updatedImageFile])


  //fetch the post
  useEffect(() => {

    async function getPost() {

      try {
        const response = await axios.get(url + `/post/getPostByID/${postID}`, {
          withCredentials: true
        })

        if (response.data.status) {

          setTitle(response.data.post.title)
          setCurrentImage(response.data.post.photo)
          setCategories(response.data.post.categories)
          setDescription(response.data.post.description)
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


  const handleAddCategory = () => {

    if (inputCategory) {
      setInputCategory("")
      const newCategory = { _id: Date.now().toString(32), name: inputCategory }

      setCategories(prev => [...prev, newCategory])
    }

    else {
      errorToast("Write a category")
    }
  }


  const updateBlog = async () => {

    if (!title) {
      errorToast("Title is required")
    }

    else if (title.length > 100) {
      errorToast("Title cannot exceed 100 characters")
    }

    else if (categories.length === 0) {
      errorToast("At least one category is required")
    }

    else if (!description) {
      errorToast("Description is required")
    }

    else if (description.length < 50) {
      errorToast("Description must be at least 50 characters long")
    }

    //finally update the post
    else if (updatedImageFile) {

      setLoading(true)

      const formData = new FormData()
      formData.append("file", updatedImageFile)

      try {

        const responseOfUploadImage = await axios.post(
          url + '/image/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
          }
        )

        if (responseOfUploadImage.data.status) { 
          await updatePostReq({
            postID, 
            title, 
            description, 
            responseOfUploadImage, 
            categories, 
            updatedImageFile, 
            currentImage, 
            setLoading, 
            navigate
          })
        }

        else {
          throw new Error(responseOfUploadImage.data.message)
        }
      }

      catch (error) {
        errorToast(error.message)
        setLoading(false)

        if (error.message.toLowerCase().includes("token")) {

          dispatch(LogOut())
          navigate("/login")
        }
      }
    }

    else {
      await updatePostReq({
        postID, 
        title, 
        description, 
        categories, 
        updatedImageFile, 
        currentImage, 
        setLoading, 
        navigate
      })
    }
  }

  return (
    <div className="min-h-[72vh] py-4">

      <div className="xl:w-[85vw] w-[90vw] mx-auto flex flex-col gap-y-5">

        <Heading label="Update Post" />

        <Input
          type="text"
          placeholder="Enter post title"
          extraStyle="w-[300px] px-4 py-2"
          name="title"
          value={title}
          handleChange={(e) => setTitle(e.target.value)}
        />

        <div
          className="sm:w-[400px] w-[300px] h-[250px] bg-cover bg-center bg-no-repeat rounded-md"
          style={{ backgroundImage: `url(${updatedImageFile ? imageURL : (imageFolder + currentImage)})` }}
        >
        </div>

        <Button
          label="Choose an Image"
          extraStyle="w-[200px] px-4 py-2"
          handleClick={() => fileRef.current.click()}
        />

        <input
          ref={fileRef}
          type="file"
          onChange={(e) => setUpdatedImageFile(e.target.files[0])}
          hidden
        />

        <div className="flex flex-col gap-y-4">

          <div className="flex gap-x-2">

            <Input
              type="text"
              placeholder="Enter post category"
              extraStyle="w-[300px] px-4 py-2"
              value={inputCategory}
              handleChange={(e) => setInputCategory(e.target.value)}
              handleKeyDown={(e) => e.key === "Enter" ? handleAddCategory() : ""}
            />

            <Button
              label="Add"
              extraStyle="px-4 py-2"
              handleClick={handleAddCategory}
            />

          </div>

          <div className="flex flex-wrap gap-3">

            {categories.map(category => {
              return (
                <CreatedCategories
                  key={category._id}
                  category={category}
                  setCategories={setCategories}
                />
              );
            })}

          </div>

        </div>

        <textarea
          className="border-[2px] border-black text-[18px] rounded-lg px-4 py-2 outline-none"
          rows={9}
          cols={30}
          placeholder="Enter post description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button
          label="Update Blog"
          extraStyle="self-center w-[200px] py-3"
          handleClick={updateBlog}
          loading={loading}
        />

      </div>

    </div>
  )
}

export default EditPost
