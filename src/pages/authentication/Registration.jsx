import Heading from "../../components/authentication/Heading"
import Input from "../../components/authentication/Input"
import Button from "../../components/authentication/Button"
import Form from './../../components/authentication/Form';
import MainContainer from "../../components/authentication/MainContainer";
import AskingToRedirect from "../../components/authentication/AskingToRedirect";
import { useFormik } from "formik";
import { signUp } from "../../validation/validation";
import ErrorMessage from "../../components/authentication/ErrorMessage";
import { url } from './../../url';
import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import successToast from "../../functions/successToast";
import errorToast from "../../functions/errorToast";
import { Helmet } from "react-helmet-async";

const Registration = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const initialValues = {
    username: "",
    email: "",
    password: ""
  }

  const formik = useFormik({
    initialValues,
    onSubmit: () => createNewUser(),
    validationSchema: signUp,
  })

  const createNewUser = async () => {
    setLoading(true)

    try {

      const response = await axios.post(url + "/auth/registration", {
        username: formik.values.username,
        email: formik.values.email,
        password: formik.values.password
      })

      if (response.data.status) {

        setLoading(false)

        formik.resetForm()

        successToast(response.data.message)

        const timeOutID = setTimeout(() => {
          navigate("/login")
        }, 2000)

        return () => clearTimeout(timeOutID)
      }

      else {
        throw new Error(response.data.message)
      }
    }

    catch (error) {
      setLoading(false)
      errorToast(error.message)
    }
  }

  return (
    <>
      <Helmet>
        <title>Registration</title>
      </Helmet>
      
      <MainContainer>

        <Form handleSubmit={formik.handleSubmit}>

          <Heading label="Create an account" />

          <Input formik={formik} type="text" name="username" />

          <ErrorMessage formik={formik} name="username" />

          <Input formik={formik} type="email" name="email" />

          <ErrorMessage formik={formik} name="email" />

          <Input formik={formik} type="password" name="password" />

          <ErrorMessage formik={formik} name="password" />

          <Button loading={loading} label="Register" />

          <AskingToRedirect asking="Already have an account?" path="login" label="Login" />

        </Form>

      </MainContainer>
    </>
  )
}

export default Registration
