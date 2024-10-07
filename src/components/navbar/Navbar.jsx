import { useLocation, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import RedirectButton from "./RedirectButton";
import { useDispatch, useSelector } from 'react-redux';
import { FaAngleDown } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";
import { url } from "../../url";
import { LogOut } from "../../features/slices/userLoginSlice";
import { emptyPosts, fetchPosts, toggleLoading, togglePostsAvailability } from "../../features/slices/postsSlice";
import errorToast from "../../functions/errorToast";
import warningToast from "../../functions/warningToast";
import { BeatLoader } from "react-spinners";

const Navbar = () => {
  const user = useSelector(state => state.UserLogin.user);
  const location = useLocation()
  const [isHovered, setIsHovered] = useState(false)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const renderSearchBar = user && (location.pathname === "/" || location.pathname === "/myPosts")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogOut = async () => {
    setLoading(true)

    try {
      const response = await axios.get(url + "/auth/logout", { withCredentials: true })
      setLoading(false)

      if (response.data.status) {
        setIsHovered(false)
        dispatch(LogOut())

        if (!(location.pathname === "/")) {
          navigate("/login")
        }
      }

      else {
        throw new Error(response.data.message);
      }
    }

    catch (error) {
      errorToast(error.message)
      setLoading(false)
    }
  }

  const handleSearchBlog = async () => {

    if (`?search=${search}` === location.search) {
      warningToast("You already searched it..")
    }

    else if (search) {

      dispatch(toggleLoading(true))

      if (location.pathname === "/") {

        navigate(`?search=${search}`)
        setSearch("")
        //rest of the things will be handled in Home page's useEffect 
      }

      else if (location.pathname === "/myPosts") {

        navigate(`/myPosts?search=${search}`)
        setSearch("")
        //rest of the things will be handled in myPosts page's useEffect 
      }
    }

    else {
      errorToast("Please write something in the search bar")
    }
  }

  const handleGetAllPosts = async () => {
    navigate("/")
    dispatch(toggleLoading(true))

    try {

      const response = await axios.get(url + "/post/readAllPosts")

      if (response.data.status) {
        dispatch(fetchPosts(response.data.posts))
        dispatch(toggleLoading(false))
        dispatch(togglePostsAvailability(true))
      }

      else {
        throw new Error(response.data.message);
      }
    }

    catch (error){
      dispatch(emptyPosts())
      dispatch(toggleLoading(false))
      dispatch(togglePostsAvailability(false))

      errorToast(error.message)
    }
  }

  return (
    <div className="min-h-[10vh] pt-5">

      <div className="xl:w-[85vw] w-[90vw] mx-auto flex md:flex-row flex-col justify-between items-center gap-y-5">

        <h1
          onClick={handleGetAllPosts}
          className="font-jotiRegular text-[28px] cursor-pointer"
        >
          Blog Market
        </h1>

        {renderSearchBar && (

          <div className="w-[320px] h-[50px] bg-gray-100 flex justify-center items-center rounded-full">

            <div
              className="bg-gray-200 w-[18%] h-full flex justify-center items-center rounded-l-full cursor-pointer"
              onClick={handleSearchBlog}
            >

              <IoIosSearch className="w-[25px] h-[25px]" />

            </div>

            <input
              type="text"
              className="bg-gray-100 text-[20px] grow rounded-r-full px-[10px] outline-none"
              placeholder="Search blog..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              onKeyDown={(e) => e.key === "Enter" ? handleSearchBlog() : ""}
            />

          </div>
        )}

        {user ? (

          <div
            className="flex items-center space-x-1 cursor-pointer relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >

            <span className="text-[22px] group-hover:font-semibold py-1">Options</span>

            <FaAngleDown />

            {isHovered && (
              <div className="bg-black text-white w-[170px] flex flex-col absolute top-9 left-[-50px] rounded-md">

                <RedirectButton
                  path={`/profile/${user.id}`}
                  label="Profile"
                  extraStyle="p-2 border-b-[1px] hover:bg-slate-200 hover:text-black transition-all duration-200 rounded-t-md"
                  handleClick={() => setIsHovered(false)}
                />

                <RedirectButton
                  path="/myPosts"
                  label="My Blogs"
                  extraStyle="p-2 border-b-[1px] hover:bg-slate-200 hover:text-black transition-all duration-200"
                  handleClick={() => setIsHovered(false)}
                />

                <RedirectButton
                  path="/createPost"
                  label="Create a Blog"
                  extraStyle="p-2 border-b-[1px] hover:bg-slate-200 hover:text-black transition-all duration-200"
                  handleClick={() => setIsHovered(false)}
                />

                <button
                  className="p-2 text-start text-[20px] hover:font-semibold hover:bg-slate-200 hover:text-black transition-all duration-200 rounded-b-md"
                  onClick={handleLogOut}
                >
                  {loading ? <BeatLoader color="#fff" size={10} /> : "Log Out"}
                </button>

              </div>
            )}

          </div>

        ) : (

          <div className="flex items-center space-x-4">

            <RedirectButton path="/login" label="Login" />

            <RedirectButton path="/registration" label="Register" />

          </div>
        )}

      </div>

    </div>
  );
};

export default Navbar;
