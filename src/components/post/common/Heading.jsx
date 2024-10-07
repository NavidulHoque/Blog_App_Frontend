/* eslint-disable react/prop-types */

const Heading = ({label, extraStyle, handleClick}) => {
  return (
    <h2 
      className={`text-[24px] font-bold ${extraStyle}`}
      onClick={handleClick}
    >
      {label}
    </h2>
  )
}

export default Heading
