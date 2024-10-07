/* eslint-disable no-unused-vars */
import axios from "axios"
import { url } from "../url"
import successToast from "./successToast"
import errorToast from "./errorToast"

export default async function updatePostReq({postID, title, description, responseOfUploadImage, categories, updatedImageFile, currentImage, setLoading, navigate}) {
    try {

        const responseOfPostUpdate = await axios.put(url + `/post/${postID}`,
            {
                title,
                description,
                photo: (updatedImageFile ? responseOfUploadImage?.data?.image : currentImage),
                categories: categories.map(category => category.name),
            },
            { withCredentials: true })

        setLoading(false)

        if (responseOfPostUpdate.data.status) {

            successToast(responseOfPostUpdate.data.message)

            if (updatedImageFile) {

                try {
                    const responseOfDeleteImage = await axios.delete(url + `/image/delete/${currentImage}`, { withCredentials: true })

                    if (!responseOfDeleteImage.data.status) {
                        throw new Error("")
                    }
                } 
                
                catch (error) {
                    navigate(`/post/${responseOfPostUpdate.data.post.postID}`)
                }
            }

            navigate(`/post/${responseOfPostUpdate.data.post.postID}`)
        }

        else {
            throw new Error(responseOfPostUpdate.data.message)
        }
    }

    catch (error) {
        errorToast(error.message)

        if (updatedImageFile) {
            await axios.delete(url + `/image/delete/${responseOfUploadImage.data.image}`, { withCredentials: true })
        }
    }
}