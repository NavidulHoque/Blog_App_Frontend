import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

const LoggedInPages = () => {
  const user = useSelector((state) => state.UserLogin.user)
  return user && <Outlet />
}

export default LoggedInPages