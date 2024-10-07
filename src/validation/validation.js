import * as Yup from "yup";

export const signUp = Yup.object({

    username: Yup.string()
        .required("Username is required")
        .min(5, "Username must be at least 5 characters long")
        .max(15, "Username cannot exceed 15 characters")
        .matches(/^[a-zA-Z0-9]+$/, "No special characters and space are allowed"),

    email: Yup.string()
        .required("Email is required")
        .matches(/^\S+@\S+\.\S+$/, "Please enter a valid email address"),

    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/^(?=.*\d)(?=.*[\W_]).{8,}$/, "Password must contain at least one number and one special character")
});

export const signIn = Yup.object({

    email: Yup.string()
        .required("Please fill up your email"),

    password: Yup.string()
        .required("Please fill up your password"),
});

export const updateUser = Yup.object({

    username: Yup.string()
        .required("Username is required")
        .min(5, "Username must be at least 5 characters long")
        .max(15, "Username cannot exceed 15 characters")
        .matches(/^[a-zA-Z0-9]+$/, "No special characters and space are allowed"),

    email: Yup.string()
        .required("Email is required")
        .matches(/^\S+@\S+\.\S+$/, "Please enter a valid email address"),

    currentPassword: Yup.string(),

    newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .matches(/^(?=.*\d)(?=.*[\W_]).{8,}$/, "Password must contain at least one number and one special character")
});
