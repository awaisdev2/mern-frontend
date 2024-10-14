import React, { useState } from "react";
import { Spinner } from "react-bootstrap";

import GenericModal from "../../../components/Modal";
import NotesForm from "./NotesForm";
import { useGetNote } from "../../../queries/notes";

const NotesCard = () => {
  const [showModal, setShowModal] = useState(false);
  const { data: notesData, isFetching } = useGetNote();
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
        {isFetching && (
          <div className="d-flex justify-content-between my-3">
            <Spinner />
            <p className="font-bold">Loading...</p>
          </div>
        )}

        {!isFetching &&
          notesData?.data?.map((note) => (
            <div key={note?.id} className="border my-3 p-3 rounded">
              <h3>{note.title}</h3>
              <p>{note.description}</p>
            </div>
          ))}
      </div>

      <GenericModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        title="Create a note"
        footer={false}
      >
        <NotesForm setShowModal={setShowModal} />
      </GenericModal>
    </div>
  );
};

export default NotesCard;
