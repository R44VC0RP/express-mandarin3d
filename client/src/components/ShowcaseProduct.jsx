import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { useCart } from '../context/Cart';
import { toast } from 'sonner';

function ShowcaseProduct({ product_title, product_description, product_image_url="https://via.placeholder.com/300", product_price, product_features=[], product_fileid, product_author="Mandarin 3D", product_author_url="https://mandarin3d.com", product_license="Public Domain" }) {
  const cart = useCart();

  const handleAddToCart = async () => {
    if (!cart || !cart.addFile) {
      console.error('Cart context is not available');
      toast.error('Unable to add file to cart at this time');
      return;
    }

    try {
      const result = await cart.addFile(product_fileid);
      if (result.status === 'success') {
        toast.success('File added to cart successfully');
      } else {
        toast.error(result.message || 'Failed to add file to cart');
      }
    } catch (error) {
      console.error('Error adding file to cart:', error);
      toast.error('An error occurred while adding the file to cart');
    }
  };

  return (
    <div className="bg-[#2A2A2A] border-[#5E5E5E] border-2 rounded-[15px] overflow-hidden">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{product_title}</h3>
        <img src={product_image_url} alt={product_title} className="w-full h-48 object-cover rounded-[15px] mb-4" />
        <p className='text-xs mb-4 text-gray-400'>Made by: <a href={product_author_url} className='text-[#0D939B]'>{product_author}</a> | <span className='text-gray-400'>{product_license}</span></p>
        <p className='text-xs mb-4 text-gray-400'>{product_description}</p>
        <div className="flex justify-between mb-4">
          <ul className="flex-1">
            {product_features.map((feature, index) => (
              <li key={index} className="flex items-center mb-2">
                <FaCheck className="text-[#0D939B] mr-2" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <p className="text-lg font-bold ml-4">${product_price}</p>
        </div>
        <button className="primary-button w-full" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

export default ShowcaseProduct;