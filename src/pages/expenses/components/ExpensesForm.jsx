import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, Form as BootstrapForm, Row, Col, Card } from "react-bootstrap";
import moment from "moment";
import Select from "react-select";

import { useCreateExpense, useUpdateExpense } from "../../../queries/expenses";

const ExpensesForm = ({
  setShowModal,
  selectedExpense,
  setSelectedExpense,
}) => {
  const { mutateAsync: createExpense, isPending } = useCreateExpense();
  const { mutateAsync: updateExpense, isPending: isUpdating } =
    useUpdateExpense();

  const ExpenseSchema = Yup.object().shape({
    amount: Yup.number().required("Amount is required"),
    currency: Yup.string().required("Currency is required"),
    category: Yup.string().required("Category is required"),
    date: Yup.date()
      .max(moment().format("YYYY-MM-DD"), "Date cannot be in the future")
      .required("Date is required"),
    paymentType: Yup.string().required("Payment type is required"),
    description: Yup.string().optional(),
  });

  const categoryOptions = [
    { value: "groceries", label: "Groceries" },
    { value: "rent", label: "Rent" },
    { value: "utilities", label: "Utilities" },
    { value: "transportation", label: "Transportation" },
    { value: "miscellaneous", label: "Miscellaneous" },
  ];

  const paymentTypeOptions = [
    { value: "cash", label: "Cash Payment" },
    { value: "online", label: "Online Transaction" },
  ];

  const currencyOptions = [
    { value: "dollar", label: "US Dollars" },
    { value: "aus_dollars", label: "Austrailian Dollars" },
    { value: "euro", label: "Euros" },
    { value: "pound", label: "Pounds" },
    { value: "canadian_dollars", label: "Canadian Dollars" },
    { value: "pkr", label: "Pakistani Rupee" },
    { value: "inr", label: "Indian Rupee" },
    { value: "sar", label: "Saudi Riyal" },
  ];

  const initialValues = {
    amount: selectedExpense?.amount || "",
    currency: selectedExpense?.currency || "",
    category: selectedExpense?.category || "",
    date: moment(selectedExpense?.date).format("YYYY-MM-DD") || "",
    paymentType: selectedExpense?.paymentType || "",
    description: selectedExpense?.description || "",
  }

  return (
    <Card className="border-0">
      <Card.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={ExpenseSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              if (selectedExpense) {
                console.log('values', values)
                await updateExpense({ id: selectedExpense?._id, data: values });
              } else {
                await createExpense(values);
              }
              setShowModal(false);
              setSelectedExpense(null);
              resetForm();
            } catch (error) {
              console.log(error);
            }
          }}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form as={BootstrapForm}>
              <Row className="mb-3">
                <Col md={3}>
                  <BootstrapForm.Group controlId="amount">
                    <BootstrapForm.Label>Amount</BootstrapForm.Label>
                    <Field
                      name="amount"
                      type="number"
                      className="form-control"
                      placeholder="Enter amount here..."
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {errors.amount && touched.amount ? (
                      <BootstrapForm.Text className="text-danger">
                        {errors.amount}
                      </BootstrapForm.Text>
                    ) : null}
                  </BootstrapForm.Group>
                </Col>
                <Col md={3}>
                  <BootstrapForm.Group controlId="currency">
                    <BootstrapForm.Label>Currency</BootstrapForm.Label>
                    <Select
                      options={currencyOptions}
                      name="currency"
                      value={currencyOptions.find(option => option.value === initialValues.currency)}
                      onChange={(value) =>
                        setFieldValue("currency", value.value)
                      }
                    />
                    {errors.currency && touched.currency ? (
                      <BootstrapForm.Text className="text-danger">
                        {errors.currency}
                      </BootstrapForm.Text>
                    ) : null}
                  </BootstrapForm.Group>
                </Col>
                <Col md={6}>
                  <BootstrapForm.Group controlId="date">
                    <BootstrapForm.Label>Date</BootstrapForm.Label>
                    <Field name="date" type="date" className="form-control" />
                    {errors.date && touched.date ? (
                      <BootstrapForm.Text className="text-danger">
                        {errors.date}
                      </BootstrapForm.Text>
                    ) : null}
                  </BootstrapForm.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <BootstrapForm.Group controlId="paymentType">
                    <BootstrapForm.Label>Payment Type</BootstrapForm.Label>
                    <Select
                      options={paymentTypeOptions}
                      name="paymentType"
                      value={paymentTypeOptions.find(option => option.value === initialValues.paymentType)}
                      onChange={(value) =>
                        setFieldValue("paymentType", value.value)
                      }
                    />
                    {errors.paymentType && touched.paymentType ? (
                      <BootstrapForm.Text className="text-danger">
                        {errors.paymentType}
                      </BootstrapForm.Text>
                    ) : null}
                  </BootstrapForm.Group>
                </Col>
                <Col md={6}>
                  <BootstrapForm.Group controlId="category">
                    <BootstrapForm.Label>Category</BootstrapForm.Label>
                    <Select
                      options={categoryOptions}
                      name="category"
                      value={categoryOptions.find(option => option.value === initialValues.category)}
                      onChange={(value) =>
                        setFieldValue("category", value.value)
                      }
                    />
                    {errors.category && touched.category ? (
                      <BootstrapForm.Text className="text-danger">
                        {errors.category}
                      </BootstrapForm.Text>
                    ) : null}
                  </BootstrapForm.Group>
                </Col>
              </Row>

              <BootstrapForm.Group controlId="description" className="mb-3">
                <BootstrapForm.Label>Description</BootstrapForm.Label>
                <Field
                  name="description"
                  as="textarea"
                  rows={3}
                  className="form-control"
                  placeholder="Enter description here..."
                />
              </BootstrapForm.Group>

              <div className="d-flex justify-content-end">
                <Button
                  variant="dark"
                  disabled={isPending || isUpdating}
                  type="submit"
                  className="mt-3"
                >
                  {isPending || isUpdating ? "Loading..." : "Submit"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default ExpensesForm;
