import React from 'react';

function ProductItem({ imageUrl, title, description }) {
  return (
    <div className="bg-[#2A2A2A] border-[#5E5E5E] border-2 rounded-[15px] overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
    </div>
  );
}

export default ProductItem;