import React, { Fragment } from 'react';

const GroceryCard = ({ item }) => {
  return (
    <div>
      <p>ITEM: {item.itemName}</p>
      <p>LAST PURCHASE DATE: {item.lastPurchase ? item.lastPurchase : 'NA'}</p>
      <p>FREQUENCY: {item.frequency}</p>
    </div>
  );
};

export default GroceryCard;
