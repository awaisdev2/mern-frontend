/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from "react";
import { Table, Card, Form, Button, Badge } from "react-bootstrap";
import { debounce } from "lodash";

import { useGetTodo, useDeleteTodo } from "../../../queries/todos";
import GenericModal from "../../../components/Modal";
import TodosForm from "./TodosForm";
import Loading from "../../../components/Loading";

const TodosCard = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const { data: todos, isFetching } = useGetTodo(debouncedSearch);
  const { mutateAsync: deleteTodo, isPending } = useDeleteTodo();

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
      <div className="d-flex justify-content-between align-items-center flex-wrap manager-header">
        <h3>Your Todos</h3>
        <Form className="mt-3 d-flex">
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="Search by title"
              className="border border-1 border-black"
              value={search}
              onChange={handleSearchChange}
            />
          </Form.Group>
          <button
            type="button"
            className="btn btn-outline-dark ms-2 btn-sm"
            onClick={() => setShowModal(true)}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </Form>
      </div>

      {isFetching && <Loading />}
      {!isFetching && sortedTodos?.length < 1 && (
        <p className="m-2">No Todos Available!</p>
      )}

      {!isFetching && sortedTodos?.length > 0 && (
        <Card className="mt-4 shadow">
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
                  <tr key={todo._id}>
                    <td className={`${todo.priority && "bg-warning-subtle"}`}>
                      {todo.title}
                    </td>
                    <td className={`${todo.priority && "bg-warning-subtle"}`}>
                      {todo.description || "N/A"}
                    </td>
                    <td className={`${todo.priority && "bg-warning-subtle"}`}>
                      {todo.isCompleted ? (
                        <Badge bg="secondary">Completed</Badge>
                      ) : (
                        <Badge bg="success">Pending</Badge>
                      )}
                    </td>
                    <td className={`${todo.priority && "bg-warning-subtle"}`}>
                      <Button
                        variant="outline-dark"
                        className="ms-2"
                        onClick={() => handleEdit(todo)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        className="ms-2"
                        onClick={() => {
                          setTodoToDelete(todo._id);
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
        </Card>
      )}

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

export default TodosCard;
