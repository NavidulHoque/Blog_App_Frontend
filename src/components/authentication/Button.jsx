/* eslint-disable react/prop-types */
import { BeatLoader } from "react-spinners"

const Button = ({ label, loading }) => {
  return (
    <button 
      type="submit" 
      className="bg-black disabled:bg-[rgb(50,50,50)] text-white text-[22px] w-full py-[10px] rounded-md cursor-pointer"
      disabled={loading}
    >

      {loading ? <BeatLoader color="#fff" size={10} /> : label}

    </button>
  )
}

export default Button
