/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from "react";
import { Table, Card, Spinner, Form, Button, Badge } from "react-bootstrap";
import { debounce } from "lodash";

import { useGetTodo, useDeleteTodo } from "../../../queries/todos";
import GenericModal from "../../../components/Modal";
import TodosForm from "./TodosForm";

const TodosCard = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const { data: todos, isFetching } = useGetTodo(debouncedSearch);
  const { mutateAsync: deleteTodo } = useDeleteTodo();

  const handleDelete = async () => {
    if (todoToDelete) {
      try {
        await deleteTodo(todoToDelete);
        setTodoToDelete(null);
      } catch (error) {
        console.log(error);
      }
      setShowConfirmDelete(false);
    }
  };

  const handleEdit = (todo) => {
    setSelectedTodo(todo);
    setShowModal(true);
  };

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

  const sortedTodos = todos?.data?.sort((a, b) => {
    if (a.priority === b.priority) return 0;
    return a.priority ? -1 : 1;
  });

  return (
    <div className="p-5">
      <div className="d-flex justify-content-between align-items-start">
        <h3>Your Todos</h3>
        <Form className="mt-3 d-flex">
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="Search by title"
              value={search}
              onChange={handleSearchChange}
            />
          </Form.Group>
          <button
            type="button"
            className="btn btn-outline-dark ms-2"
            onClick={() => setShowModal(true)}
          >
            Create a Todo
          </button>
        </Form>
      </div>

      {isFetching && (
        <div className="d-flex justify-content-between my-3">
          <Spinner />
          <p className="font-bold">Loading...</p>
        </div>
      )}

      <Card className="mt-4 shadow">
        {!isFetching && sortedTodos?.length === 0 && (
          <p className="m-2">No Todos Available!</p>
        )}
        {!isFetching && sortedTodos?.length > 0 && (
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTodos.map((todo) => (
                  <tr key={todo.id}>
                    <td className={`${todo.priority && "bg-warning-subtle"}`}>{todo.title}</td>
                    <td className={`${todo.priority && "bg-warning-subtle"}`}>{todo.description || "N/A"}</td>
                    <td className={`${todo.priority && "bg-warning-subtle"}`}>
                      {todo.isCompleted ? (
                        <Badge bg="secondary">Completed</Badge>
                      ) : (
                        <Badge bg="success">Pending</Badge>
                      )}
                    </td>
                    <td className={`${todo.priority && "bg-warning-subtle"}`}>
                      <Button
                        variant="outline-primary"
                        className="ms-2"
                        onClick={() => handleEdit(todo)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        className="ms-2"
                        onClick={() => {
                          setTodoToDelete(todo.id);
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
        )}
      </Card>

      <GenericModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setSelectedTodo(null);
        }}
        size={"lg"}
        title={selectedTodo ? "Edit Todo" : "Create a Todo"}
      >
        <TodosForm
          setShowModal={setShowModal}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
        />
      </GenericModal>

      <GenericModal
        show={showConfirmDelete}
        handleClose={() => setShowConfirmDelete(false)}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete this todo?</p>
        <div className="mt-3 d-flex justify-content-end">
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => setShowConfirmDelete(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" className="ms-2" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </GenericModal>
    </div>
  );
};

export default TodosCard;
