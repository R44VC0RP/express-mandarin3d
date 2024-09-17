import React, { useEffect, useRef } from 'react';

const BackgroundEffects = () => {
  const blueLight1Ref = useRef(null);
  const blueLight2Ref = useRef(null);
  const blueLight3Ref = useRef(null);

  useEffect(() => {
    const animate = (element, duration, delay) => {
      element.animate([
        { transform: 'translate(0, 0)', opacity: 0.3 },
        { transform: 'translate(10px, 10px)', opacity: 0.5 },
        { transform: 'translate(0, 0)', opacity: 0.3 }
      ], {
        duration: duration,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)', // Smoother easing function
        delay: delay
      });
    };

    animate(blueLight1Ref.current, 10000, 0); // Increased duration for smoother animation
    animate(blueLight2Ref.current, 12000, 0);
    animate(blueLight3Ref.current, 14000, 0);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div ref={blueLight1Ref} className="absolute top-0 left-0 w-2/3 h-2/3 bg-[#0D939B] rounded-full filter blur-[120px] opacity-30 -translate-x-1/4 -translate-y-1/4 transition-all duration-1000"></div>
      <div ref={blueLight2Ref} className="absolute top-0 right-0 w-2/3 h-2/3 bg-[#0D939B] rounded-full filter blur-[120px] opacity-30 translate-x-1/4 -translate-y-1/4 transition-all duration-1000"></div>
      <div ref={blueLight3Ref} className="absolute bottom-0 left-1/2 w-2/3 h-2/3 bg-[#0D939B] rounded-full filter blur-[120px] opacity-20 -translate-x-1/2 translate-y-1/4 transition-all duration-1000"></div>
      
      {/* Slanted lines with random filled squares */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(45deg, transparent 48%, rgba(13, 147, 155, 0.5) 49%, rgba(13, 147, 155, 0.5) 51%, transparent 52%),
          linear-gradient(-45deg, transparent 48%, rgba(13, 147, 155, 0.5) 49%, rgba(13, 147, 155, 0.5) 51%, transparent 52%)
        `,
        backgroundSize: '60px 60px'
      }}></div>
      
      {/* Randomly filled squares */}
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle, rgba(13, 147, 155, 0.3) 10%, transparent 10%)`,
        backgroundSize: '60px 60px',
        backgroundPosition: '0 0, 30px 30px',
        mask: `
          linear-gradient(45deg, rgba(0,0,0,0.1) 48%, black 49%, black 51%, rgba(0,0,0,0.1) 52%),
          linear-gradient(-45deg, rgba(0,0,0,0.1) 48%, black 49%, black 51%, rgba(0,0,0,0.1) 52%)
        `,
        maskSize: '60px 60px'
      }}></div>
    </div>
  );
};

export default BackgroundEffects;