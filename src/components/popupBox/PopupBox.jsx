import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Popup = ({ show, handleClose, title, children, showFooter, footerText,handleAdd }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      {showFooter && (
        <Modal.Footer>
             <Button variant="primary" type="submit" onClick ={handleAdd}>
                    ADD +
                  </Button>
          <Button variant="secondary" onClick={handleClose}>
            {footerText || 'Close'}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default Popup;