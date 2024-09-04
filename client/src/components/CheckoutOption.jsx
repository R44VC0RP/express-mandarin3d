import React from 'react';

function CheckoutOption({ id, name, description, price, onCheck }) {
  return (
    <div className="flex items-start mt-2">
      <div className="flex items-start mt-2 cursor-pointer" onClick={() => document.getElementById(id).click()}>
        <input 
          id={id} 
          type="checkbox" 
          className="mr-2 mt-1" 
          onChange={(e) => onCheck(id, e.target.checked)}
        />
        <div>
          <p className="text-md text-white font-bold">
            {name} {price > 0 && `+$${price.toFixed(2)}`}
          </p>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutOption;