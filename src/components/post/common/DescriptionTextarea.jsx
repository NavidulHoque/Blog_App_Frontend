/* eslint-disable react/prop-types */

const DescriptionTextarea = ({description, handleChange}) => {
    return (
        <textarea
            className="border-[2px] border-black text-[18px] rounded-lg px-4 py-2 outline-none"
            rows={9}
            cols={30}
            placeholder="Enter post description"
            value={description}
            onChange={handleChange}
        />
    )
}

export default DescriptionTextarea
