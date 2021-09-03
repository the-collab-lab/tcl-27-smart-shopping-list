import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

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
            Share this token: <br />
            <b>{localStorage.getItem('token')}</b>
          </p>
        </Accordion.Body>
      </Accordion>
    </div>
  );
};
export default UserToken;
