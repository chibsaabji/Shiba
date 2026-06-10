import React, { useState, useEffect } from 'react';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';

function App() {
  const [controlsEnabled, setControlsEnabled] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Disable controls as soon as the user starts scrolling down
      if (window.scrollY > 50 && controlsEnabled) {
        setControlsEnabled(false);
      } else if (window.scrollY <= 50 && !controlsEnabled) {
        setControlsEnabled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controlsEnabled]);

  return (
    <>
      <div className="bg-mesh" aria-hidden="true">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <Scene controlsEnabled={controlsEnabled} />
      <Overlay />
    </>
  );
}

export default App;
