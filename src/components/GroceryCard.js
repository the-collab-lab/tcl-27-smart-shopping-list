import React, { Fragment } from 'react';

const GroceryCard = ({ item, userToken }) => {
  let itemExists = item && (
    <Fragment>
      <p>ID: {item.id}</p>
      <p>ITEM: {item.itemName}</p>
      <p>
        LAST PURCHASE DATE:{' '}
        {item.lastPurchase ? item.lastPurchase.toDate().toDateString() : 'NA'}
      </p>
      <p>FREQUENCY: {item.frequency}</p>
      <p>USER TOKEN: {userToken}</p>
    </Fragment>
  );

  return <Fragment>{itemExists}</Fragment>;
};

export default GroceryCard;
