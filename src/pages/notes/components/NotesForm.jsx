import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useCreateNote } from "../../../queries/notes";

const NotesForm = ({setShowModal}) => {
  const { mutateAsync: createNote } = useCreateNote();

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Content is required"),
  });

  return (
    <div className="notes-form">
      <Formik
        initialValues={{
          title: "",
          description: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await createNote(values);
            setShowModal(false)
            resetForm();
          } catch (error) {
            console.error("Error creating note:", error);
          }
        }}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <Field
                id="title"
                name="title"
                type="text"
                className="form-control"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-danger text-sm"
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="description">Description</label>
              <Field
                as="textarea"
                name="description"
                className="form-control"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-danger text-sm"
              />
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button
                type="submit"
                className="btn btn-dark"
                disabled={
                  isSubmitting ||
                  values.title.trim() === "" ||
                  values.description.trim() === ""
                }
              >
                Create Note
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NotesForm;
