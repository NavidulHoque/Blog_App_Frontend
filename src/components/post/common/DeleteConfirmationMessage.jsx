/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import { BeatLoader } from "react-spinners";

const DeleteConfirmationMessage = ({ setOpen, handleDelete, loading }) => {
    
    return (
        <div className="fixed top-0 w-full z-30 bg-[rgba(0,0,0,0.4)] h-screen flex items-center justify-center font-fredokaRegular">

            <div className='bg-white xl:w-[25%] md:w-[40%] w-[80%] rounded-md p-[10px] space-y-4'>

                <div className="relative">

                    <RxCross2
                        onClick={() => setOpen(false)}
                        className="absolute top-0 right-0 cursor-pointer"
                    />

                </div>

                <span className="w-[50px] h-[50px] flex justify-center items-center text-[30px] text-red-500 border-[3px] border-red-500 rounded-full mx-auto"><RxCross2 /></span>

                <h3 className="text-[20px] text-center">Are You Sure?</h3>

                <p className="text-[15px] text-slate-500 text-center">Do you really want to delete these records? This process cannot be undone</p>

                <div className="w-full flex gap-x-2">

                    <button 
                        className="w-[50%] text-[20px] py-[5px] bg-[#2ecc71] hover:bg-[#27ae60] text-white"
                        onClick={() => setOpen(false)}
                    >
                        No
                    </button>

                    <button 
                        className="w-[50%] text-[20px] py-[5px] bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleDelete()}
                        disabled={loading}
                    >
                        {loading ? <BeatLoader color="#fff" size={10} /> : "Yes"}
                    </button>

                </div>

            </div>
            
        </div>
    )
}

export default DeleteConfirmationMessage
