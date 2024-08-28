import React from 'react';
import { FaCheck } from 'react-icons/fa';

function PricingPlan({ title, price, features }) {
  return (
    <div className="bg-[#2A2A2A] border-[#5E5E5E] border-2 rounded-[15px] p-6 flex flex-col h-full">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-3xl font-bold mb-6">${price}<span className="text-sm font-normal">/month</span></p>
      <ul className="flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center mb-2">
            <FaCheck className="text-[#0D939B] mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className="primary-button mt-6">Choose Plan</button>
    </div>
  );
}

export default PricingPlan;