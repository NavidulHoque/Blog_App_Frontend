/* eslint-disable react/prop-types */

const Input = ({formik, type, name}) => {
  return (
    <input 
        type={type}
        className="w-full text-[22px] border-[3px] border-black py-[5px] px-[10px]"
        onChange={formik.handleChange}
        value={formik.values[name]}
        placeholder={`Enter your ${name}`}
        name={name}
    />
  )
}

export default Input
