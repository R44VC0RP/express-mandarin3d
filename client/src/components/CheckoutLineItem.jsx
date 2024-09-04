import React from 'react';

const CheckoutLineItem = ({ item_name, item_price, item_quantity }) => (
  <div className="flex justify-between items-center mb-2">
    <div className="flex-grow">
      <p className="truncate">{item_name}</p>
    </div>
    <div className="flex items-center">
      <p className="text-sm text-gray-400 mr-2">{item_quantity}x</p>
      <p>${(item_price * item_quantity).toFixed(2)}</p>
    </div>
  </div>
);

export default CheckoutLineItem;