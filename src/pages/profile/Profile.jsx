import { useFormik } from "formik";
import Button from "../../components/post/common/Button"
import Heading from "../../components/post/common/Heading"
import Input from "../../components/post/common/Input"
import { useState } from 'react';
import { FaKey } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from "../../validation/validation";
import ErrorMessage from "../../components/authentication/ErrorMessage";
import { formatDistance } from 'date-fns'
import errorToast from "../../functions/errorToast";
import axios from "axios";
import { url } from "../../url";
import { LogIn } from "../../features/slices/userLoginSlice";
import successToast from "../../functions/successToast";
import { Helmet } from "react-helmet-async";

const Profile = () => {
    const [willChangePassword, setWillChangePassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const user = useSelector(state => state.UserLogin.user)
    const dispatch = useDispatch()

    const initialValues = {
        username: user.username,
        email: user.email,
        currentPassword: "",
        newPassword: ""
    }

    const formik = useFormik({
        initialValues,
        onSubmit: () => UpdateUser(),
        validationSchema: updateUser,
    })


    const UpdateUser = async () => {

        if (formik.values.currentPassword && !formik.values.newPassword) {
            errorToast("Please enter a new password")
        }

        else if (!formik.values.currentPassword && formik.values.newPassword) {
            errorToast("Please enter your current password")
        }

        else {
            setLoading(true)

            try {
                const response = await axios.put(url + `/user/${user.id}`, {
                    username: formik.values.username,
                    email: formik.values.email,
                    currentPassword: formik.values.currentPassword,
                    newPassword: formik.values.newPassword
                },
                    { withCredentials: true })

                if (response.data.status) {

                    dispatch(LogIn(response.data.updatedUser))
                    successToast(response.data.message)
                    setLoading(false)
                }

                else {
                    throw new Error(response.data.message)
                }
            }

            catch (error) {
                errorToast(error.message)
                setLoading(false)
            }
        }
    }

    return (
        <>
            <Helmet>
                <title>Profile</title>
            </Helmet>
            
            <div className="min-h-[72vh] flex justify-center items-center py-4">

                <div className="xl:w-[85vw] w-[90vw] mx-auto flex flex-col gap-y-7">

                    <form
                        className="bg-slate-100 self-center sm:w-[600px] w-[320px] text-[22px] flex flex-col p-4 rounded-lg"
                        onSubmit={formik.handleSubmit}
                    >

                        <div className="flex justify-between items-center">

                            <Heading label="Profile" />

                            <div className="flex flex-col items-center space-y-1 text-slate-600">

                                <span>Last Updated</span>
                                <span>{formatDistance(user.updatedAt, new Date(), { addSuffix: true })}</span>

                            </div>

                        </div>

                        <div className="flex flex-col gap-y-3 my-4">

                            <label htmlFor="email">Email Address</label>

                            <Input
                                type="email"
                                placeholder="email"
                                extraStyle="w-full px-4 py-2"
                                name="email"
                                id="email"
                                value={formik.values.email}
                                handleChange={formik.handleChange}
                            />

                            <ErrorMessage formik={formik} name="email" />

                        </div>

                        <div className="flex flex-col gap-y-3 mb-4">

                            <label htmlFor="username">Username</label>

                            <Input
                                type="text"
                                placeholder="username"
                                extraStyle="w-full px-4 py-2"
                                name="username"
                                id="username"
                                value={formik.values.username}
                                handleChange={formik.handleChange}
                            />

                            <ErrorMessage formik={formik} name="username" />

                        </div>

                        <div className="flex flex-col gap-y-3 mb-4">

                            <label>Joined</label>

                            <input
                                type="text"
                                className="text-[18px] px-4 py-2 rounded-lg outline-none"
                                value={new Date(user.createdAt).toLocaleDateString()}
                                readOnly
                            />

                        </div>

                        <span
                            className="self-start flex items-center gap-x-1 text-blue-500 text-underline cursor-pointer mb-4"
                            onClick={() => setWillChangePassword(prev => !prev)}
                        >
                            <FaKey /> Change Password
                        </span>

                        <div className={`${willChangePassword ? "h-[230px] opacity-100 mb-2" : "h-0 opacity-0"} overflow-hidden transition-all duration-300 flex flex-col gap-y-2`}>

                            <label htmlFor="currentPassword" className="h-[32px]">Current Password</label>

                            <Input
                                type="password"
                                placeholder="enter your current password"
                                extraStyle="w-full px-4 py-2 h-[52px]"
                                name="currentPassword"
                                id="currentPassword"
                                value={formik.values.currentPassword}
                                handleChange={formik.handleChange}
                            />

                            <label htmlFor="newPassword" className="h-[32px]">New Password</label>

                            <Input
                                type="password"
                                placeholder="enter your new password"
                                extraStyle="w-full px-4 py-2 h-[52px]"
                                name="newPassword"
                                id="newPassword"
                                value={formik.values.newPassword}
                                handleChange={formik.handleChange}
                            />

                            <ErrorMessage formik={formik} name="newPassword" />

                        </div>

                        <div className="flex gap-x-2">

                            <Button
                                label="Update"
                                extraStyle="px-4 py-2"
                                type="submit"
                                loading={loading}
                            />

                        </div>

                    </form>

                </div>

            </div>
        </>
    )
}

export default Profile
