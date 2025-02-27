import React, { useState, useEffect, memo } from 'react';

export const AnimatedProgressBar = memo(({ progress = 85 }) => {
    const [animate, setAnimate] = useState(false);
  
    useEffect(() => {
      // Delay animation start to avoid initial layout thrashing
      const timer = setTimeout(() => {
        setAnimate(true);
      }, 50);
      
      return () => clearTimeout(timer);
    }, []);

    const progressValue = typeof progress === 'string' ? parseInt(progress, 10) : progress;
  
    // Reduced number of decorative elements and simplified animations
    const styles = `
      .progress2 {
        padding: 6px;
        border-radius: 30px;
        background: hsl(var(--muted));
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
        overflow: hidden;
        will-change: transform; /* Hardware acceleration hint */
      }
      .progress-bar2 {
        height: 18px;
        border-radius: 30px;
        background-image: 
          linear-gradient(to bottom, hsla(var(--primary), 0.3), hsla(var(--primary), 0.05));
        transition: 0.4s linear;
        transition-property: width, background-color;
        position: relative;
        overflow: hidden;
        transform: translateZ(0); /* Force GPU rendering */
        will-change: width, background-color;
      }
      .progress-moved .progress-bar2 {
        width: ${progressValue}%;
        background-color: hsl(var(--primary));
        animation: progressAnimation 0.8s ease-out;
      }
      .glitter-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      .glitter {
        position: absolute;
        width: 2px;
        height: 2px;
        background-color: #FFD700;
        border-radius: 50%;
        opacity: 0;
        animation: sparkle 2s infinite;
        transform: translateZ(0); /* Force GPU rendering */
      }
      @keyframes progressAnimation {
        0%   { width: 5%; background-color: hsla(var(--primary), 0.5);}
        100% { width: ${progressValue}%; background-color: hsl(var(--primary)); }
      }
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0) translateZ(0); }
        50% { opacity: 1; transform: scale(1.5) translateZ(0); }
      }
    `;

    return (
      <div className="mb-3">
        <div className={`progress2 ${animate ? 'progress-moved' : ''}`}>
          <div className="progress-bar2" style={{ width: `${progressValue}%` }}>
            <div className="glitter-container">
              {/* Reduced to 10 glitter elements instead of 50 total animated elements */}
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className="glitter" 
                  style={{ 
                    left: `${Math.random() * 100}%`, 
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 1}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  });