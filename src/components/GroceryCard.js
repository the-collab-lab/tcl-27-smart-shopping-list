import React from 'react';

const GroceryCard = ({ item, userToken }) => {
  return (
    <div>
      <p>ID: {item.id}</p>
      <p>ITEM: {item.itemName}</p>
      <p>
        LAST PURCHASE DATE:{' '}
        {item.lastPurchase ? item.lastPurchase.toDate().toDateString() : 'NA'}
      </p>
      <p>FREQUENCY: {item.frequency}</p>
      <p>USER TOKEN: {userToken}</p>
    </div>
  );
};

export default GroceryCard;
