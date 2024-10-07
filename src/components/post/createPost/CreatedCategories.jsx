/* eslint-disable react/prop-types */
import { TbXboxXFilled } from "react-icons/tb";

const CreatedCategories = ({category, setCategories}) => {

  return (
    <div className="bg-gray-200 flex items-center gap-x-2 px-3 py-2 rounded-lg">

        <p className="text-[20px]">{category.name}</p>
        <TbXboxXFilled 
          className="w-[30px] h-[30px] cursor-pointer"
          onClick={() => setCategories(prevCategories => prevCategories.filter(prevCategory => prevCategory._id !== category._id))}
        />
      
    </div>
  )
}

export default CreatedCategories
