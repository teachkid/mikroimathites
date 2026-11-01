import React, { createContext, useContext, useState, useEffect } from 'react';
import { playPop } from '../utils/sound';

const ViewModeContext = createContext();

export function ViewModeProvider({ children }) {
  // viewMode can be 'pc' | 'mobile' | 'auto'
  const [viewMode, setViewModeState] = useState(() => {
    try {
      const saved = localStorage.getItem('mikroi_mathites_view_mode');
      if (saved === 'pc' || saved === 'mobile' || saved === 'auto') {
        return saved;
      }
    } catch (e) {}
    // Default to auto (adapts to current device)
    return 'auto';
  });

  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth;
    return 1200;
  });

  // Mobile orientation when simulated on desktop: 'portrait' | 'landscape'
  const [phoneOrientation, setPhoneOrientation] = useState('portrait');

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Shortcut key: Ctrl/Cmd + Shift + M to toggle PC / Mobile mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        playPop();
        setViewModeState((prev) => {
          const next = prev === 'mobile' ? 'pc' : 'mobile';
          try {
            localStorage.setItem('mikroi_mathites_view_mode', next);
          } catch (err) {}
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setViewMode = (mode) => {
    playPop();
    setViewModeState(mode);
    try {
      localStorage.setItem('mikroi_mathites_view_mode', mode);
    } catch (e) {}
  };

  const toggleViewMode = () => {
    playPop();
    setViewModeState((prev) => {
      // Toggle between pc and mobile
      const current = prev === 'auto' ? (windowWidth < 768 ? 'mobile' : 'pc') : prev;
      const next = current === 'pc' ? 'mobile' : 'pc';
      try {
        localStorage.setItem('mikroi_mathites_view_mode', next);
      } catch (e) {}
      return next;
    });
  };

  // Determine effective display mode: 'pc' or 'mobile'
  const effectiveMode = viewMode === 'auto'
    ? (windowWidth < 768 ? 'mobile' : 'pc')
    : viewMode;

  // Is the user viewing on a physical wide desktop screen (>= 900px)?
  const isPhysicalDesktop = windowWidth >= 900;

  // Should we show the realistic smartphone bezel simulator?
  // Only when simulated mobile mode is active ON a physical wide desktop screen.
  const showMobileSimulator = effectiveMode === 'mobile' && isPhysicalDesktop;

  return (
    <ViewModeContext.Provider
      value={{
        viewMode,
        setViewMode,
        toggleViewMode,
        effectiveMode,
        phoneOrientation,
        setPhoneOrientation,
        windowWidth,
        isPhysicalDesktop,
        showMobileSimulator,
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}
