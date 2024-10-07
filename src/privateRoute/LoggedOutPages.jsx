import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

const LoggedOutPages = () => {
  const user = useSelector((state) => state.UserLogin.user)
  return !user && <Outlet />
}

export default LoggedOutPages