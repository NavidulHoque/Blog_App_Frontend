/* eslint-disable react/prop-types */

const Input = ({type, placeholder, extraStyle, name, id, handleChange, handleKeyDown, value}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`border-[2px] border-black text-[18px] rounded-lg outline-none ${extraStyle}`}
            name={name}
            id={id}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={value}
        />
    )
}

export default Input
