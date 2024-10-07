import { useNavigate } from "react-router-dom"
import Button from "../../components/authentication/Button"
import Heading from "../../components/authentication/Heading"
import Input from "../../components/authentication/Input"
import Form from "../../components/authentication/Form"
import MainContainer from "../../components/authentication/MainContainer"
import AskingToRedirect from "../../components/authentication/AskingToRedirect"
import { useFormik } from "formik"
import { signIn } from "../../validation/validation"
import { url } from "../../url"
import { useDispatch } from "react-redux";
import { LogIn } from "../../features/slices/userLoginSlice"
import ErrorMessage from "../../components/authentication/ErrorMessage"
import axios from "axios"
import { useState } from "react"
import errorToast from "../../functions/errorToast"

const Login = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const initialValues = {
    email: "",
    password: ""
  }

  const formik = useFormik({
    initialValues,
    onSubmit: () => login(),
    validationSchema: signIn,
  })

  const login = async () => {
    setLoading(true)

    try {

      const response = await axios.post(url + "/auth/login", { 
        email: formik.values.email, 
        password: formik.values.password 
      }, {withCredentials: true})

      if (response.data.status) {

        formik.resetForm()

        dispatch(LogIn(response.data.loggedInUser))

        setLoading(false)

        navigate("/")
      }

      else {
        throw new Error(response.data.message)
      }
    }

    catch (error){
      errorToast(error.message)
      setLoading(false)
    }
  }

  return (
      <MainContainer>

        <Form handleSubmit={formik.handleSubmit}>

          <Heading label="Log in to your account" />

          <Input formik={formik} type="email" name="email" />

          <ErrorMessage formik={formik} name="email" />

          <Input formik={formik} type="password" name="password" />

          <ErrorMessage formik={formik} name="password" />

          <Button loading={loading} label="Log in" />

          <AskingToRedirect asking="Don't have an account?" path="registration" label="Register" />

        </Form>

      </MainContainer>
    )
  }

  export default Login
