import Navbar from "./components/navbar/Navbar"
import { Outlet } from 'react-router-dom';
import Footer from './components/footer/Footer';
import { ToastContainer } from "react-toastify";

const RootLayout = () => {
  return (
    <>
      <ToastContainer />
      <div className="min-h-screen font-fredokaRegular text-[18px] md:text-xl lg:text-2xl">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  )
}

export default RootLayout
