/* eslint-disable react/prop-types */
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const BlogPost = ({post}) => {
  const user = useSelector(state => state.UserLogin.user)

  return (
    <div className="flex space-x-3 w-full">
      
      <div 
        className='min-w-[300px] h-[260px] bg-cover bg-center bg-no-repeat rounded-md lg:inline-block hidden'
        style={{ backgroundImage: `url(${post?.photoURL})` }}
      >
      </div>

      <div className="flex flex-col gap-y-3 grow">

        <h1 className="text-[30px] font-bold sm:text-left text-center">{post?.title}</h1>

        <div className="flex justify-between items-center font-medium text-green-600">

          <span>{post?.userInfo?.username}</span>

          <div className="space-x-4">

            <span>{new Date(post?.updatedAt).toLocaleDateString() + ","}</span>
            <span>{new Date(post?.updatedAt).toLocaleTimeString()}</span>

          </div>

        </div>

        <div className="space-x-1 font-normal">

          <p className="break-words">{post?.description.slice(0,280)}</p>

          <span className="text-blue-500 inline-block">{"..."}</span>

          <Link to={`${user ? `/post/${post.postID}` : "/login"}`} className="text-blue-500 cursor-pointer">Read more</Link>

        </div>

      </div>

    </div>
  )
}

export default BlogPost
