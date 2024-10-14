import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
  const { mutateAsync: registerUser } = useRegisterUser();
  const { mutateAsync: loginUser } = useUserLogin();
  const { userLogin } = useAuth();

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
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
              onSubmit={async (values, { resetForm }) => {
                try {
                  await registerUser(values);
                  resetForm();
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              <Form>
                <h1>Create Account</h1>
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
                <button type="submit">Sign Up</button>
              </Form>
            </Formik>
          </div>
          <div className="form-container sign-in">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchemaSignIn}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const response = await loginUser(values);
                  userLogin(response.data);
                  resetForm();
                } catch (error) {
                  console.error(error);
                }
              }}
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
                <a href="/">Forget Your Password?</a>
                <button type="submit">Sign In</button>
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
            onSubmit={async (values, { resetForm }) => {
              try {
                await registerUser(values);
                resetForm();
              } catch (error) {
                console.error(error);
              }
            }}
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
              <button type="submit">Sign Up</button>
              <button
                onClick={handleSignInClick}
                className="mt-3 bg-transparent text-dark text-decoration-underline"
              >
                Already have an account?
              </button>
            </Form>
          </Formik>
        ) : (
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchemaSignIn}
            onSubmit={async (values, { resetForm }) => {
              try {
                const response = await loginUser(values);
                userLogin(response.data);
                resetForm();
              } catch (error) {
                console.error(error);
              }
            }}
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
              <button type="submit">Sign In</button>
              <button
                onClick={handleSignUpClick}
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
