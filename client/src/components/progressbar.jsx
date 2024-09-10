import React, { useState, useEffect } from 'react';

export const AnimatedProgressBar = ({ progress = 85 }) => {
    const [animate, setAnimate] = useState(false);
  
    useEffect(() => {
      setAnimate(true);
    }, []);
  
    return (
      <div className="mb-3">
        <div className={`progress2 ${animate ? 'progress-moved' : ''}`}>
          <div className="progress-bar2" style={{ width: `${progress}%` }}>
            <div className="stars-container">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="star" 
                  style={{ 
                    left: `${Math.random() * 100}%`, 
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
            <div className="glitter-container">
              {[...Array(30)].map((_, i) => (
                <div 
                  key={i} 
                  className="glitter" 
                  style={{ 
                    left: `${Math.random() * 100}%`, 
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${0.5 + Math.random() * 1}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          .progress2 {
            padding: 6px;
            border-radius: 30px;
            background: hsl(var(--muted));
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
            overflow: hidden;
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
          }
          .progress-moved .progress-bar2 {
            width: ${progress}%;
            background-color: hsl(var(--primary));
            animation: progressAnimation 3s;
          }
          .stars-container, .glitter-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background-color: white;
            border-radius: 50%;
            opacity: 0;
            animation: twinkle 1s infinite alternate;
          }
          .glitter {
            position: absolute;
            width: 1px;
            height: 1px;
            background-color: #FFD700;
            border-radius: 50%;
            opacity: 0;
            animation: sparkle 2s infinite;
          }
          @keyframes progressAnimation {
            0%   { width: 5%; background-color: hsla(var(--primary), 0.5);}
            100% { width: ${progress}%; background-color: hsl(var(--primary)); }
          }
          @keyframes twinkle {
            0% { opacity: 0; transform: scale(1); }
            100% { opacity: 1; transform: scale(1.5); }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  };