import React from 'react';

const GroceryCard = ({ item }) => {
  return (
    <div>
      ID: {item.id}
      <br />
      ITEM: {item.item} <br />
      QUANTITY: {item.quantity} <br />
      FREQUENCY: {item.frequency}
    </div>
  );
};

export default GroceryCard;
