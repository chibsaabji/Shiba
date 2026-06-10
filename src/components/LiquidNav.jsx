import React, { useState, useRef, useEffect, useCallback } from 'react';

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const DogsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5c-2.5 0-4.5 2-4.5 4.5S9.5 14 12 14s4.5-2 4.5-4.5S14.5 5 12 5z" />
    <circle cx="7.5" cy="8.5" r="2.5" />
    <circle cx="16.5" cy="8.5" r="2.5" />
    <circle cx="9.5" cy="4.5" r="2.5" />
    <circle cx="14.5" cy="4.5" r="2.5" />
  </svg>
);

const InfoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const tabs = [
  { id: 'home', label: 'Home', icon: HomeIcon, target: '#home' },
  { id: 'menu', label: 'Menu', icon: MenuIcon, target: '#menu' },
  { id: 'dogs', label: 'Dogs', icon: DogsIcon, target: '#dogs' },
  { id: 'info', label: 'Info', icon: InfoIcon, target: '#info' }
];

export const LiquidNav = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isDark, setIsDark] = useState(false);
  const [pillStyle, setPillStyle] = useState({ width: 0, transform: 'translateX(0px)', opacity: 0 });
  
  const navRef = useRef(null);
  const buttonRefs = useRef({});
  const glareRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const updatePill = useCallback(() => {
    const activeBtn = buttonRefs.current[activeTab];
    if (activeBtn) {
      setPillStyle({
        width: `${activeBtn.offsetWidth}px`,
        transform: `translateX(${activeBtn.offsetLeft}px)`,
        opacity: 1,
        transition: 'transform 0.5s cubic-bezier(0.34,1.2,0.64,1), width 0.5s cubic-bezier(0.34,1.2,0.64,1)'
      });
    }
  }, [activeTab]);

  useEffect(() => {
    // Initial setup with a slight delay to ensure fonts/DOM are ready
    const timer = setTimeout(updatePill, 50);
    window.addEventListener('resize', updatePill);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePill);
    };
  }, [updatePill]);

  const handleMouseMove = (e) => {
    if (navRef.current && glareRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glareRef.current.style.setProperty('--x', `${x}px`);
      glareRef.current.style.setProperty('--y', `${y}px`);
    }
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab.id);
    const element = document.querySelector(tab.target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="liquid-nav" id="nav" ref={navRef} onMouseMove={handleMouseMove}>
      <div className="liquid-glare-container">
        <div className="liquid-glare" id="glare" ref={glareRef}></div>
      </div>

      <div className="nav-items">
        <div className="active-pill" id="active-pill" style={pillStyle}></div>

        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              ref={el => buttonRefs.current[tab.id] = el}
              className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleNavClick(tab)}
            >
              <div className="btn-content">
                <Icon />
                <span>{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="divider"></div>

      <button
        className="theme-btn"
        id="theme-btn"
        aria-label="Dark Mode Toggle"
        onClick={() => setIsDark(!isDark)}
      >
        <div className="theme-icon-wrapper">
          <svg className="sun" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg className="moon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </div>
      </button>
    </nav>
  );
};
