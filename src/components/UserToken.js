import React from 'react';
import Accordion from 'react-bootstrap/accordion';

const UserToken = () => {
  return (
    <div className="tokenAccordion">
      <Accordion>
        <Accordion.Header>
          <p>
            <em>Want to share your shopping list?</em>
          </p>
        </Accordion.Header>
        <Accordion.Body>
          <p>
            Share this token: <b>{localStorage.getItem('token')}</b>
          </p>
        </Accordion.Body>
      </Accordion>
    </div>
  );
};
export default UserToken;
