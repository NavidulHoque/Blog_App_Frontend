/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"

const RedirectButton = ({path, label, extraStyle, handleClick}) => {
  return (
    <Link 
      to={`${path}`} 
      className={`hover:font-semibold ${extraStyle}`}
      onClick={handleClick}
    >
      {label}
    </Link>
  )
}

export default RedirectButton
