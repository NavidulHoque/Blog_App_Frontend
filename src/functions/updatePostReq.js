import axios from "axios"
import { url } from "../url"
import successToast from "./successToast"
import errorToast from "./errorToast"
import { ref, deleteObject } from "firebase/storage";
import { LogOut } from "../features/slices/userLoginSlice";

export default async function updatePostReq({ postID, title, description, categories, updatedImageFile, currentImage, downloadURL, setLoading, navigate, dispatch, storage }) {
    try {

        const response = await axios.put(url + `/post/${postID}`,
            {
                title,
                description,
                photoURL: (updatedImageFile ? downloadURL : currentImage),
                categories: categories.map(category => category.name),
            },
            { withCredentials: true })

        if (response.data.status) {

            setLoading(false)

            successToast(response.data.message)

            if (updatedImageFile) {

                const storageRef = ref(storage, currentImage)

                deleteObject(storageRef)
                    .then(() => {

                        navigate(`/post/${response.data.post.postID}`)
                    })
                    .catch(() => {

                        navigate(`/post/${response.data.post.postID}`)
                    })
            }

            else {
                navigate(`/post/${response.data.post.postID}`)
            }
        }

        else {
            throw new Error(response.data.message)
        }
    }

    catch (error) {
        setLoading(false)
        errorToast(error.message)

        if (updatedImageFile) {

            const storageRef = ref(storage, downloadURL)

            deleteObject(storageRef)
        }

        if (error.message.toLowerCase().includes("token")) {

            dispatch(LogOut())
            navigate("/login")
        }
    }
}