import React from 'react';

const UserToken = () => {
  return (
    <div>
      <p>
        If you want to share your list please share this token:{' '}
        {localStorage.getItem('token')}
      </p>
    </div>
  );
};
export default UserToken;
