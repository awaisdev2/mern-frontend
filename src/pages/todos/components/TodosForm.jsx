import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, Form as BootstrapForm, Row, Col, Card } from "react-bootstrap";
import Select from "react-select";

import { useCreateTodo, useUpdateTodo } from "../../../queries/todos";

const TodosForm = ({ setShowModal, selectedTodo, setSelectedTodo }) => {
  const { mutateAsync: createTodo } = useCreateTodo();
  const { mutateAsync: updateTodo } = useUpdateTodo();

  const TodoSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().optional(),
    isCompleted: Yup.boolean().optional(),
    priority: Yup.boolean().optional(), 
  });

  const initialValues = {
    title: selectedTodo?.title || "",
    description: selectedTodo?.description || "",
    isCompleted: selectedTodo?.isCompleted || false,
    priority: selectedTodo?.priority || false,
  };

  const isCompletedOptions = [
    { value: true, label: "Completed" },
    { value: false, label: "Pending" },
  ];

  return (
    <Card className="border-0">
      <Card.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={TodoSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              if (selectedTodo) {
                await updateTodo({ id: selectedTodo?.id, data: values });
              } else {
                await createTodo(values);
              }
              setShowModal(false);
              setSelectedTodo(null);
              resetForm();
            } catch (error) {
              console.log(error);
            }
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form as={BootstrapForm}>
              <Row className="mb-3">
                <Col md={6}>
                  <BootstrapForm.Group controlId="title">
                    <BootstrapForm.Label>Title</BootstrapForm.Label>
                    <Field
                      name="title"
                      type="text"
                      className="form-control"
                      placeholder="Enter title"
                    />
                    {errors.title && touched.title ? (
                      <BootstrapForm.Text className="text-danger">
                        {errors.title}
                      </BootstrapForm.Text>
                    ) : null}
                  </BootstrapForm.Group>
                </Col>
                <Col md={6}>
                  <BootstrapForm.Group controlId="isCompleted">
                    <BootstrapForm.Label>Status</BootstrapForm.Label>
                    <Select
                      name="isCompleted"
                      value={isCompletedOptions.find(
                        (option) => option.value === values.isCompleted
                      )}
                      onChange={(option) =>
                        setFieldValue("isCompleted", option.value)
                      }
                      options={isCompletedOptions}
                    />
                  </BootstrapForm.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <BootstrapForm.Group controlId="description">
                    <BootstrapForm.Label>Description</BootstrapForm.Label>
                    <Field
                      as="textarea"
                      name="description"
                      className="form-control"
                      placeholder="Enter description"
                    />
                    {errors.description && touched.description ? (
                      <BootstrapForm.Text className="text-danger">
                        {errors.description}
                      </BootstrapForm.Text>
                    ) : null}
                  </BootstrapForm.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <BootstrapForm.Group controlId="priority">
                    <BootstrapForm.Check
                      type="checkbox"
                      label="Mark as Priority"
                      name="priority"
                      checked={values.priority}
                      onChange={(e) => setFieldValue("priority", e.target.checked)}
                    />
                  </BootstrapForm.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end">
                <Button variant="dark" type="submit">
                  {selectedTodo ? "Update Todo" : "Create Todo"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default TodosForm;
