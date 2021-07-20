import React from 'react';

const GroceryCard = ({ item }) => {
  return (
    <div>
      <p>ID: {item.id}</p>
      <p>ITEM: {item.itemName}</p>
      <p>LAST PURCHASE DATE: {item.lastPurchase}</p>
      <p>FREQUENCY: {item.frequency}</p>
      <p>USER TOKEN: {item.userToken}</p>
    </div>
  );
};

export default GroceryCard;
