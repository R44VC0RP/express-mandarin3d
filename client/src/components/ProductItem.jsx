import React from 'react';

function ProductItem({ src_file, title, description, imageOrVideo = 'image', footnotes = [] }) {
  return (
    <div className="bg-[#2A2A2A] border-[#5E5E5E] border-2 rounded-[15px] overflow-hidden">
        {imageOrVideo === 'image' ? (
            <img src={src_file} alt={title} className="w-full h-48 object-cover" />
        ) : (
            <video src={src_file} alt={title} className="w-full h-48 object-cover" autoPlay muted loop />
        )}
      <div className="p-4">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-base text-gray-300">{description}</p>
      </div>
      <div className='p-4'>
        {footnotes.map((footnote, index) => (
          <p key={index} className='text-xs text-gray-300'>*{footnote}</p>
        ))}
      </div>
    </div>
  );
}

export default ProductItem;