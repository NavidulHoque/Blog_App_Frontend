/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"

const AskingToRedirect = ({asking, path, label}) => {
  return (
    <p>{asking} <Link to={`/${path}`} className="text-blue-500">{label}</Link></p>
  )
}

export default AskingToRedirect
