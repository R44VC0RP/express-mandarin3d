import React from 'react';
import BackgroundEffects from '../components/BackgroundEffects'; // Import the new component

function Marketplace() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white relative">
      <BackgroundEffects /> {/* Use the new component */}
      {/* Rest of your component code */}
    </div>
  );
}

export default Marketplace;