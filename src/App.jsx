import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import RootLayout from "./RootLayout"
import Home from './pages/home/Home';
import Login from './pages/authentication/Login';
import Registration from './pages/authentication/Registration';
import PostDetails from "./pages/Post/PostDetails";
import CreatePost from "./pages/Post/CreatePost";
import EditPost from "./pages/Post/EditPost";
import Profile from "./pages/profile/Profile";
import MyPosts from "./pages/Post/MyPosts";
import LoggedInPages from "./privateRoute/LoggedInPages";
import LoggedOutPages from './privateRoute/LoggedOutPages';

const App = () => {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route>

      <Route element={<RootLayout />}>

        <Route path="/" element={<Home />}></Route>

        <Route element={<LoggedInPages />}>

          <Route path="/createPost" element={<CreatePost />}></Route>

          <Route path="/post/:postID" element={<PostDetails />}></Route>

          <Route path="/edit/:postID" element={<EditPost />}></Route>

          <Route path="/profile/:userID" element={<Profile />}></Route>

          <Route path="/myPosts" element={<MyPosts />}></Route>

        </Route>

        <Route element={<LoggedOutPages />}>

          <Route path="/login" element={<Login />}></Route>

          <Route path="/registration" element={<Registration />}></Route>

        </Route>

      </Route>

    </Route>
  ))

  return (
    <RouterProvider router={router} />
  )
}

export default App
