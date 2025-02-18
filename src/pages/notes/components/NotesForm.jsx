import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useCreateNote, useUpdateNote } from "../../../queries/notes";

const NotesForm = ({ setShowModal, selectedNote, setSelectedNote }) => {
  const { mutateAsync: createNote, isPending: isCreating } = useCreateNote();
  const { mutateAsync: updateNote, isPending: isUpdating } = useUpdateNote();

  const validationSchema = Yup.object({
    title: Yup.string()
      .max(70, "Title must be less than 70 characters")
      .required("Title is required"),
    description: Yup.string()
      .max(200, "Description must be less than 200 characters")
      .required("Description is required"),
  });

  return (
    <div className="notes-form">
      <Formik
        initialValues={{
          title: selectedNote?.title || "",
          description: selectedNote?.description || "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            if (selectedNote) {
              await updateNote({ id: selectedNote?._id, data: values });
            } else {
              await createNote(values);
            }
            setShowModal(false);
            setSelectedNote(null);
            resetForm();
          } catch (error) {
            console.error("Error creating note:", error);
          }
        }}
      >
        {({ values }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <Field
                id="title"
                name="title"
                placeholder="Enter title..."
                type="text"
                className="form-control"
              />
              <div className="d-flex justify-content-between">
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-danger text-sm"
                />
                <small className="text-muted">{values.title.length}/70</small>
              </div>
            </div>

            <div className="form-group mt-3">
              <label htmlFor="description">Description</label>
              <Field
                as="textarea"
                name="description"
                placeholder="Enter description..."
                className="form-control"
              />
              <div className="d-flex justify-content-between">
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-danger text-sm"
                />
                <small className="text-muted">
                  {values.description.length}/200
                </small>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button
                type="submit"
                className="btn btn-dark"
                disabled={
                  isCreating ||
                  isUpdating ||
                  values.title.trim() === "" ||
                  values.description.trim() === ""
                }
              >
                {isCreating || isUpdating ? "Loading..." : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NotesForm;
