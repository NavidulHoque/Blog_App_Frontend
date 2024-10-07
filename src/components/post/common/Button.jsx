/* eslint-disable react/prop-types */
import { BeatLoader } from "react-spinners"

const Button = ({label, extraStyle, handleClick, loading, type}) => {
  return (
    <button 
      onClick={handleClick} 
      className={`bg-black text-white font-semibold rounded-lg ${extraStyle}`}
      disabled={loading}
      type={type || "button"}
    >
      {loading ? <BeatLoader color="#fff" size={10} /> : label}
    </button>
  )
}

export default Button
