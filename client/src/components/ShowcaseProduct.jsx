import React from 'react';
import { FaCheck } from 'react-icons/fa';

function ShowcaseProduct({ 
  product_title, 
  product_description, 
  product_image_url, 
  product_price, 
  product_features, 
  product_fileid, 
  product_author, 
  product_author_url, 
  product_license, 
  onAddToCart 
}) {
  return (
    <div className="bg-[#2A2A2A] border-[#5E5E5E] border-2 rounded-[15px] overflow-hidden flex flex-col h-full">
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-semibold mb-2">{product_title}</h3>
        <img src={product_image_url} alt={product_title} className="w-full h-48 object-cover rounded-[15px] mb-4" />
        <p className='text-xs mb-2 text-gray-400'>Made by: <a href={product_author_url} className='text-[#0D939B]'>{product_author}</a> | <span className='text-gray-400'>{product_license}</span></p>
        <p className='text-xs mb-4 text-gray-400'>{product_description}</p>
        <div className="flex justify-between mb-4">
          <ul className="flex-1">
            {product_features.map((feature, index) => (
              <li key={index} className="flex items-center mb-1">
                <FaCheck className="text-[#0D939B] mr-2 text-xs" />
                <span className="text-xs">{feature}</span>
              </li>
            ))}
          </ul>
          <p className="text-lg font-bold ml-4">${product_price}</p>
        </div>
      </div>
      <div className="p-4">
        <button className="primary-button w-full" onClick={() => onAddToCart(product_fileid)}>Add to Cart</button>
      </div>
    </div>
  );
}

export default ShowcaseProduct;