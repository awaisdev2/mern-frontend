import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";

import { useRegisterUser, useUserLogin } from "../../queries/auth";
import { useAuth } from "../../hooks/auth";

import "./auth.css";

const validationSchemaSignUp = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(3, "Password must be at least 3 characters")
    .required("Password is required"),
});

const validationSchemaSignIn = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(3, "Password must be at least 3 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [registeredCredentials, setRegisteredCredentials] = useState(null);
  const { mutateAsync: registerUser, isPending: isRegistering } =
    useRegisterUser();
  const { mutateAsync: loginUser, isPending } = useUserLogin();
  const { userLogin } = useAuth();

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setProfileImage(file);
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const handleSignUpSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await registerUser(formData);
      resetForm();
      setProfileImage(null);
      setIsSignUp(false);
      // Store credentials for login form
      setRegisteredCredentials({
        email: values.email,
        password: values.password
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Desktop Form */}
      <div className="custom-container-fluid">
        <div
          className={`custom-container ${isSignUp ? "active" : ""}`}
          id="container"
        >
          <div className="form-container sign-up">
            <Formik
              initialValues={{ name: "", email: "", password: "" }}
              validationSchema={validationSchemaSignUp}
              onSubmit={handleSignUpSubmit}
            >
              <Form>
                <h2>Create Account</h2>
                <Field type="text" name="name" placeholder="Name" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger text-sm"
                />
                <Field type="email" name="email" placeholder="Email" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger text-sm"
                />
                <Field type="password" name="password" placeholder="Password" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger text-sm"
                />
                {!profileImage && <div {...getRootProps({ className: "dropzone cursor-pointer" })}>
                  <input {...getInputProps()} />
                  <p>
                    Drag & drop a profile image here, or click to select one
                  </p>
                </div>}
                {profileImage && (
                  <div>
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Profile preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "20px",
                        position: 'relative',
                      }}
                    />
                    <span
                      className="position-absolute cursor-pointer"
                      onClick={() => setProfileImage(null)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </span>
                  </div>
                )}
                <button type="submit" disabled={isRegistering}>
                  {isRegistering ? "Loading..." : "Sign Up"}
                </button>
              </Form>
            </Formik>
          </div>
          <div className="form-container sign-in">
            <Formik
              initialValues={registeredCredentials || { email: "", password: "" }}
              validationSchema={validationSchemaSignIn}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const response = await loginUser(values);
                  userLogin(response.data);
                  resetForm();
                  setRegisteredCredentials(null);
                } catch (error) {
                  console.error(error);
                }
              }}
              enableReinitialize
            >
              <Form>
                <h1>Sign In</h1>
                <Field type="email" name="email" placeholder="Email" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger text-sm"
                />
                <Field type="password" name="password" placeholder="Password" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger text-sm"
                />
                <button type="submit" disabled={isPending}>
                  {isPending ? "Loading..." : "Sign In"}
                </button>
              </Form>
            </Formik>
          </div>
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1>Welcome Back!</h1>
                <p>Enter your personal details to use all of site features</p>
                <button
                  className="hidden"
                  id="login"
                  onClick={handleSignInClick}
                  disabled={isRegistering}
                >
                  Sign In
                </button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1>Hello, Friend!</h1>
                <p>
                  Register with your personal details to use all of site
                  features
                </p>
                <button
                  className="hidden"
                  id="register"
                  onClick={handleSignUpClick}
                  disabled={isPending}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Form */}
      <div className="mobile-container d-none">
        {isSignUp ? (
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={validationSchemaSignUp}
            onSubmit={handleSignUpSubmit}
          >
            <Form className="mobile-form">
              <h1 className="mb-3">Create Account</h1>
              <Field type="text" name="name" placeholder="Name" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger text-sm"
              />
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger text-sm"
              />
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger text-sm"
              />
              <div {...getRootProps({ className: "dropzone cursor-pointer" })}>
                <input {...getInputProps()} />
                <p>Drag & drop a profile image here, or click to select one</p>
              </div>
              {profileImage && <p>Selected Image: {profileImage.name}</p>}
              <button type="submit" disabled={isRegistering}>
                {isRegistering ? "Loading..." : "Sign Up"}
              </button>
              <button
                onClick={handleSignInClick}
                className="mt-3 bg-transparent text-dark text-decoration-underline"
                disabled={isRegistering}
              >
                Already have an account?
              </button>
            </Form>
          </Formik>
        ) : (
          <Formik
            initialValues={registeredCredentials || { email: "", password: "" }}
            validationSchema={validationSchemaSignIn}
            onSubmit={async (values, { resetForm }) => {
              try {
                const response = await loginUser(values);
                userLogin(response.data);
                resetForm();
                setRegisteredCredentials(null);
              } catch (error) {
                console.error(error);
              }
            }}
            enableReinitialize
          >
            <Form className="mobile-form">
              <h1 className="mb-3">Sign In</h1>
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger text-sm"
              />
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger text-sm"
              />
              <button type="submit" disabled={isPending}>
                {isPending ? "Loading..." : "Sign In"}
              </button>
              <button
                onClick={handleSignUpClick}
                disabled={isPending}
                className="mt-3 bg-transparent text-dark text-decoration-underline"
              >
                Don't have an account?
              </button>
            </Form>
          </Formik>
        )}
      </div>
    </>
  );
};

export default LoginPage;
