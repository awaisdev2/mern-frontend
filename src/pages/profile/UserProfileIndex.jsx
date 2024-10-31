import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Button, Form as BootstrapForm, Spinner } from "react-bootstrap";

import { useAuth } from "../../hooks/auth";
import { useUpdateProfile } from "../../queries/user";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
});

const UserProfileIndex = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const { currentUser: user, setCurrentUser } = useAuth();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setNewProfileImage(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      if (newProfileImage) {
        formData.append("profileImage", newProfileImage);
      }
      const updatedUser = await updateProfile({
        userId: user?.user.id,
        data: formData,
      });

      setCurrentUser((prev) => {
        return {...prev, user: updatedUser };
      });
      setIsEditing(false);
      setNewProfileImage(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="full-height">
      <Card className="w-100 mx-auto p-3" style={{ maxWidth: "600px" }}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">My Profile</h5>
          {!isEditing ? (
            <Button
              variant="outline-secondary"
              onClick={() => setIsEditing(true)}
              className="d-flex align-items-center"
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant="outline-secondary"
              onClick={() => {
                setIsEditing(false);
                setNewProfileImage(null);
              }}
              className="d-flex align-items-center"
            >
              Cancel
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          <div className="text-center mb-4">
            <div
              className="position-relative"
              style={{ width: "128px", height: "128px", margin: "0 auto" }}
            >
              <img
                src={
                  newProfileImage
                    ? URL.createObjectURL(newProfileImage)
                    : user?.user?.profileImage || "/assets/dummy.png"
                }
                alt="Profile"
                className="rounded-circle border border-secondary"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {isEditing && (
                <div
                  {...getRootProps()}
                  className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 text-white cursor-pointer"
                  style={{ borderRadius: "50%" }}
                >
                  <input {...getInputProps()} />
                  <span>Change Photo</span>
                </div>
              )}
            </div>
            <h5 className="mt-3">{user?.user?.name}</h5>
            <p className="text-muted">{user?.user?.email}</p>
          </div>

          {isEditing && (
            <Formik
              initialValues={{
                name: user?.user?.name,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <BootstrapForm.Group controlId="name" className="mb-3">
                    <BootstrapForm.Label>Name</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </BootstrapForm.Group>

                  <div className="d-flex justify-content-end">
                    <Button type="submit" disabled={isSubmitting || isPending}>
                      {isPending ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserProfileIndex;
