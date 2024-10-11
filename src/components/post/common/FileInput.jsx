/* eslint-disable react/prop-types */

const FileInput = ({fileRef, handleChange}) => {
    return (
        <input
            ref={fileRef}
            type="file"
            onChange={handleChange}
            hidden
        />
    )
}

export default FileInput
