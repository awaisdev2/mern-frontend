import React, { useState } from "react";
import { Button } from "react-bootstrap";

import GenericModal from "../../../components/Modal";
import NotesForm from "./NotesForm";
import { useGetNote, useDeleteNote } from "../../../queries/notes";
import Loading from "../../../components/Loading";

const NotesCard = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const { data: notesData, isFetching } = useGetNote();
  const { mutateAsync: deleteNote } = useDeleteNote();

  const handleDelete = async () => {
    if (noteToDelete) {
      try {
        await deleteNote(noteToDelete);
        setSelectedNote(null);
      } catch (error) {
        console.log(error);
      }
      setShowConfirmDelete(false);
    }
  };

  const handleEdit = (expense) => {
    setSelectedNote(expense);
    setShowModal(true);
  };
  return (
    <div className="p-5">
      <div className="d-flex justify-content-between">
        <h3>Your Notes</h3>
        <button
          className="btn btn-outline-dark"
          onClick={() => setShowModal(true)}
        >
          Create a note
        </button>
      </div>

      <div>
        {isFetching && <Loading />}

        {!isFetching && notesData?.data?.length < 1 && (
          <p className="m-2">No Notes Available!</p>
        )}

        {!isFetching &&
          notesData?.data?.map((note) => (
            <div
              key={note?._id}
              className="d-flex justify-content-between bg-light align-items-center border my-3 p-3 rounded"
            >
              <div>
                <h3>{note.title}</h3>
                <p>
                  {note.description.length > 200
                    ? note.description.slice(0, 200).concat("...")
                    : note.description}
                </p>
              </div>
              <div className="d-flex">
                <button
                  className="btn btn-sm btn-outline-dark ms-2 h-fit"
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger ms-2 h-fit"
                  onClick={() => {
                    setNoteToDelete(note._id);
                    setShowConfirmDelete(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      <GenericModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setSelectedNote(null);
        }}
        title={selectedNote ? "Edit note" : "Create a note"}
      >
        <NotesForm
          setShowModal={setShowModal}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
        />
      </GenericModal>
      <GenericModal
        show={showConfirmDelete}
        handleClose={() => setShowConfirmDelete(false)}
        title="Delete note"
      >
        Are you sure you want to delete this note?
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

export default NotesCard;
