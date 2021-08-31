import React from 'react';
import Accordion from 'react-bootstrap/accordion';

const UserToken = () => {
  return (
    <div className="tokenAccordion">
      <Accordion>
        <Accordion.Header>
          <p>Want to share your shopping list?</p>
        </Accordion.Header>
        <Accordion.Body>
          <p>Share this token: {localStorage.getItem('token')}</p>
        </Accordion.Body>
      </Accordion>
    </div>
  );
};
export default UserToken;
