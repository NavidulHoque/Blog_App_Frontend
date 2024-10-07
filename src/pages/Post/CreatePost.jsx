import Heading from "../../components/post/common/Heading"
import Button from "../../components/post/common/Button"
import Input from "../../components/post/common/Input"
import CreatedCategories from "../../components/post/createPost/CreatedCategories"
import { useEffect, useRef, useState } from "react"
import axios from 'axios';
import { url } from './../../url';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut } from "../../features/slices/userLoginSlice"
import { useNavigate } from "react-router-dom"
import errorToast from "../../functions/errorToast"
import successToast from "../../functions/successToast"

const CreatePost = () => {
  const [imageFile, setImageFile] = useState(null)

  const [imageURL, setImageURL] = useState(null)

  const [title, setTitle] = useState(JSON.parse(localStorage.getItem("titleOfBlogApp")) || "")

  const [description, setDescription] = useState(JSON.parse(localStorage.getItem("descriptionOfBlogApp")) || "")

  const [inputCategory, setInputCategory] = useState("")

  const [categories, setCategories] = useState(JSON.parse(localStorage.getItem("categoriesOfBlogApp")) || [])

  const [loading, setLoading] = useState(false)

  const fileRef = useRef(null)

  const user = useSelector(state => state.UserLogin.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  useEffect(() => {

    if (imageFile?.type?.startsWith("image")) {

      const url = URL.createObjectURL(imageFile)
      setImageURL(url)

      return () => URL.revokeObjectURL(url);
    }

    else if (!imageFile?.type?.startsWith("image") && imageFile) {
      errorToast("Invalid file type. Only images are allowed.")
    }

  }, [imageFile])


  const createNewPost = async () => {

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

    //finally create the post
    else {

      setLoading(true)

      const formData = new FormData()
      formData.append("file", imageFile)

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

          try {

            const responseOfPostCreation = await axios.post(url + '/post/create',
              {
                title,
                description,
                photo: responseOfUploadImage.data.image,
                categories: categories.map(category => category.name),
                userID: user.id
              },
              { withCredentials: true })

            setLoading(false)

            if (responseOfPostCreation.data.status) {

              successToast(responseOfPostCreation.data.message)

              localStorage.setItem("titleOfBlogApp", JSON.stringify(""))
              localStorage.setItem("descriptionOfBlogApp", JSON.stringify(""))
              localStorage.setItem("categoriesOfBlogApp", JSON.stringify([]))

              navigate(`/post/${responseOfPostCreation.data.post.postID}`)
            }

            else {
              throw new Error(responseOfPostCreation.data.message)
            }
          }

          catch (error) {
            errorToast(error.message)

            await axios.delete(url + `/image/delete/${responseOfUploadImage.data.image}`, { withCredentials: true })
          }
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
  }

  const handleAddCategory = () => {

    if (inputCategory) {
      setInputCategory("")
      const newCategory = { _id: Date.now().toString(32), name: inputCategory }

      setCategories(prev => [...prev, newCategory])
      localStorage.setItem("categoriesOfBlogApp", JSON.stringify([...categories, newCategory]))
    }

    else {
      errorToast("Write a category")
    }
  }


  return (
    <div className="min-h-[72vh] py-4">

      <div className="xl:w-[85vw] w-[90vw] mx-auto flex flex-col gap-y-5">

        <Heading label="Create a post" />

        <Input
          type="text"
          placeholder="Enter post title"
          extraStyle="w-[300px] px-4 py-2"
          name="title"
          value={title}
          handleChange={(e) => {
            setTitle(e.target.value)
            localStorage.setItem("titleOfBlogApp", JSON.stringify(e.target.value))
          }}
        />

        {imageFile && (
          <div
            className="sm:w-[400px] w-[300px] h-[250px] bg-cover bg-center bg-no-repeat rounded-md"
            style={{ backgroundImage: `url(${imageURL})` }}
          >
          </div>
        )}

        <Button
          label="Choose an Image"
          extraStyle="w-[200px] px-4 py-2"
          handleClick={() => fileRef.current.click()}
          type="button"
        />

        <input
          ref={fileRef}
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
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
          onChange={(e) => {
            setDescription(e.target.value)
            localStorage.setItem("descriptionOfBlogApp", JSON.stringify(e.target.value))
          }}
        />

        <Button
          label="Create Blog"
          extraStyle="self-center w-[200px] py-3"
          handleClick={createNewPost}
          loading={loading}
        />

      </div>

    </div>
  )
}

export default CreatePost
