import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { useCart } from '../context/Cart';

function PricingPlan({ title, description, image="https://via.placeholder.com/300", price, features, fileid, author="Mandarin 3D", author_url="https://mandarin3d.com", license="Public Domain" }) {
  const cart = useCart();

  

  const handleAddToCart = async () => {
    if (!cart || !cart.addFile) {
      console.error('Cart context is not available');
      alert('Unable to add file to cart at this time');
      return;
    }

    try {
      const result = await cart.addFile(fileid);
      if (result.status === 'success') {
        alert('File added to cart successfully');
      } else {
        alert(result.message || 'Failed to add file to cart');
      }
    } catch (error) {
      console.error('Error adding file to cart:', error);
      alert('An error occurred while adding the file to cart');
    }
  };

  return (
    <div className="bg-[#2A2A2A] border-[#5E5E5E] border-2 rounded-[15px] overflow-hidden">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <img src={image} alt={title} className="w-full h-48 object-cover rounded-[15px] mb-4" />
        <p className='text-xs mb-4 text-gray-400'>Made by: <a href={author_url} className='text-[#0D939B]'>{author}</a> | <span className='text-gray-400'>{license}</span></p>
        <p className='text-xs mb-4 text-gray-400'>{description}</p>
        <div className="flex justify-between mb-4">
          <ul className="flex-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center mb-2">
                <FaCheck className="text-[#0D939B] mr-2" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <p className="text-lg font-bold ml-4">${price}</p>
        </div>
        <button className="primary-button w-full" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

export default PricingPlan;