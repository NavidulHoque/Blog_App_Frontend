import axios from "axios"
import { url } from "../url"
import successToast from "./successToast"
import errorToast from "./errorToast"

export default async function updatePostReq({ postID, title, description, categories, updatedImageFile, currentImage, downloadURL, setLoading, navigate }) {
    try {

        const response = await axios.put(url + `/post/${postID}`,
            {
                title,
                description,
                photoURL: (updatedImageFile ? downloadURL : currentImage),
                categories: categories.map(category => category.name),
            },
            { withCredentials: true })

        setLoading(false)

        if (response.data.status) {

            successToast(response.data.message)

            navigate(`/post/${response.data.post.postID}`)
        }

        else {
            throw new Error(response.data.message)
        }
    }

    catch (error) {
        errorToast(error.message)
    }
}