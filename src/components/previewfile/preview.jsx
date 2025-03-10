import React from 'react';
import { Modal, Button } from 'react-bootstrap';


const PreviewModal = ({ show, onHide, preview, fileType }) => {
  if (!fileType) {
    return null; 
  }
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {fileType.startsWith('image/') && (
          <img src={preview} alt="File Preview" style={{ width: '100%' }} />
        )}
        {fileType === 'application/pdf' && (
          <embed src={preview} type="application/pdf" width="100%" height="500px" />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PreviewModal;
