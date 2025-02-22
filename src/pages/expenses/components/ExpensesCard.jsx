/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from "react";
import { Table, Card, Form, Button } from "react-bootstrap";
import { debounce } from "lodash";

import { useGetExpenses, useDeleteExpense } from "../../../queries/expenses";
import GenericModal from "../../../components/Modal";
import ExpensesForm from "./ExpensesForm";
import Loading from "../../../components/Loading";

const currencySymbols = {
  dollar: "$",
  aus_dollars: "A$",
  euro: "€",
  pound: "£",
  canadian_dollars: "C$",
  pkr: "₨",
  inr: "₹",
  sar: "﷼",
};

const ExpensesCard = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { data: expenses, isFetching } = useGetExpenses(debouncedSearch);
  const { mutateAsync: deleteExpense, isPending } = useDeleteExpense();

  const handleDelete = async () => {
    if (expenseToDelete) {
      try {
        await deleteExpense(expenseToDelete);
        setExpenseToDelete(null);
      } catch (error) {
        console.log(error);
      }
      setShowConfirmDelete(false);
    }
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const currentMonthExpenses = expenses?.data?.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const currentDate = new Date();
    return (
      expenseDate.getFullYear() === currentDate.getFullYear() &&
      expenseDate.getMonth() === currentDate.getMonth()
    );
  });

  const totalCurrentMonthExpenses = currentMonthExpenses?.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const debounceSearch = useCallback(
    debounce((query) => {
      setDebouncedSearch(query);
    }, 500),
    []
  );

  useEffect(() => {
    debounceSearch(search);
    return () => {
      debounceSearch.cancel();
    };
  }, [search, debounceSearch]);

  return (
    <div className="p-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap manager-header">
        <h3>Your Expenses</h3>
        <Form className="mt-3 d-flex">
          <Form.Control
            type="text"
            placeholder="Search by category"
            className="border border-1 border-black"
            value={search}
            onChange={handleSearchChange}
          />
          <button
            type="button"
            className="btn btn-outline-dark ms-2 p-2"
            onClick={() => setShowModal(true)}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </Form>
      </div>

      {isFetching && <Loading />}
      {!isFetching && expenses?.data?.length < 1 && (
        <p className="m-2">No Expenses Available!</p>
      )}

      {!isFetching && expenses?.data?.length > 0 && (
        <Card className="mt-4 shadow">
          <>
            <Card.Header>
              <h5>
                Total Expenses for this Month:{" "}
                {totalCurrentMonthExpenses
                  ? totalCurrentMonthExpenses.toFixed(2)
                  : "0.00"}
              </h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Category</th>
                    <th>Payment Type</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses?.data?.map((expense) => (
                    <tr key={expense._id}>
                      <td>{expense.amount.toFixed(2)}</td>
                      <td>
                        {currencySymbols[expense.currency] || expense.currency}
                      </td>
                      <td>{expense.category}</td>
                      <td>
                        {expense.paymentType.charAt(0).toUpperCase() +
                          expense.paymentType.slice(1)}
                      </td>
                      <td>{new Date(expense.date).toLocaleDateString()}</td>
                      <td>{expense.description || "N/A"}</td>
                      <td>
                        <Button
                          variant="outline-dark"
                          onClick={() => handleEdit(expense)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          className="ms-2"
                          onClick={() => {
                            setExpenseToDelete(expense._id);
                            setShowConfirmDelete(true);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </>
        </Card>
      )}

      <GenericModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setSelectedExpense(null);
        }}
        size={"lg"}
        title={selectedExpense ? "Edit Expense" : "Create new Expense"}
      >
        <ExpensesForm
          setShowModal={setShowModal}
          selectedExpense={selectedExpense}
          setSelectedExpense={setSelectedExpense}
        />
      </GenericModal>

      <GenericModal
        show={showConfirmDelete}
        handleClose={() => setShowConfirmDelete(false)}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete this expense?</p>
        <div className="mt-3 d-flex justify-content-end">
          <Button
            variant="secondary"
            className="ms-2"
            disabled={isPending}
            onClick={() => setShowConfirmDelete(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" disabled={isPending} className="ms-2" onClick={handleDelete}>
            {isPending ? 'Loading...' : 'Delete'}
          </Button>
        </div>
      </GenericModal>
    </div>
  );
};

export default ExpensesCard;
