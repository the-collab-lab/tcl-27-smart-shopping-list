import react from 'react';
import '../css/alertMessage.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ConfirmModal = ({ confirmView, handleDelete, setConfirmView }) => {
  return (
    <>
      <Modal
        show={confirmView}
        onHide={(e) => setConfirmView(false)}
        onFocus={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setConfirmView(false)}
            onFocus={(e) => e.stopPropagation()}
          >
            No
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            onFocus={(e) => e.stopPropagation()}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmModal;
