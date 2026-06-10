import React, { useRef } from 'react';

export const LiquidPanel = ({ children, className = '', style = {} }) => {
  const panelRef = useRef(null);
  const glareRef = useRef(null);

  const handleMouseMove = (e) => {
    if (panelRef.current && glareRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glareRef.current.style.setProperty('--x', `${x}px`);
      glareRef.current.style.setProperty('--y', `${y}px`);
    }
  };

  return (
    <div 
      className={`liquid-panel ${className}`} 
      style={style} 
      ref={panelRef} 
      onMouseMove={handleMouseMove}
    >
      <div className="liquid-glare-container">
        <div className="liquid-glare" ref={glareRef}></div>
      </div>
      {children}
    </div>
  );
};
