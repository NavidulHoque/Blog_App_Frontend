/* eslint-disable react/prop-types */

const Image = ({imageURL, extraStyle}) => {
    return (
        <div
            className={`bg-cover bg-center bg-no-repeat rounded-md ${extraStyle}`}
            style={{ backgroundImage: `url(${imageURL})` }}
        >
        </div>
    )
}

export default Image
