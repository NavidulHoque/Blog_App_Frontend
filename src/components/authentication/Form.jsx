/* eslint-disable react/prop-types */

const Form = ({children, handleSubmit}) => {
  return (
    <form onSubmit={handleSubmit} className="w-[350px] flex flex-col gap-y-3">
      {children}
    </form>
  )
}

export default Form
