import React from "react";
import { Modal, Button } from "react-bootstrap";

const GenericModal = ({
  show,
  handleClose,
  size,
  title,
  children,
  footer = false,
}) => {
  return (
    <Modal show={show} onHide={handleClose} size={size} backdrop='static' centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{children}</Modal.Body>

      {footer && (
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="dark" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default GenericModal;
