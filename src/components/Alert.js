import react from 'react';
import '../css/alertMessage.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Alert = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <h4>
          {props.itemName} {props.alertPrompt}
        </h4>
      </Modal.Body>
    </Modal>
  );
};

export default Alert;
