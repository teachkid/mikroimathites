import React, { createContext, useContext, useState, useEffect } from 'react';

const ScreenTimeContext = createContext();

export function ScreenTimeProvider({ children }) {
  // 0 means no limit (unlimited)
  const [limitMinutes, setLimitMinutesState] = useState(() => {
    try {
      const saved = localStorage.getItem('mikroi_mathites_screen_limit');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    try {
      const savedLimit = localStorage.getItem('mikroi_mathites_screen_limit');
      const limit = savedLimit ? parseInt(savedLimit, 10) : 0;
      return limit > 0 ? limit * 60 : 0;
    } catch (e) {
      return 0;
    }
  });

  const [isTimeUp, setIsTimeUp] = useState(false);

  const setLimitMinutes = (minutes) => {
    const val = parseInt(minutes, 10) || 0;
    setLimitMinutesState(val);
    setRemainingSeconds(val > 0 ? val * 60 : 0);
    setIsTimeUp(false);
    try {
      localStorage.setItem('mikroi_mathites_screen_limit', String(val));
    } catch (e) {}
  };

  const extendTime = (extraMinutes) => {
    setRemainingSeconds((prev) => prev + extraMinutes * 60);
    setIsTimeUp(false);
  };

  const resetTimer = () => {
    if (limitMinutes > 0) {
      setRemainingSeconds(limitMinutes * 60);
      setIsTimeUp(false);
    }
  };

  // Timer countdown while tab is active and visible
  useEffect(() => {
    if (limitMinutes <= 0) {
      setIsTimeUp(false);
      return;
    }

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [limitMinutes]);

  return (
    <ScreenTimeContext.Provider
      value={{
        limitMinutes,
        setLimitMinutes,
        remainingSeconds,
        isTimeUp,
        extendTime,
        resetTimer,
      }}
    >
      {children}
    </ScreenTimeContext.Provider>
  );
}

export function useScreenTime() {
  const context = useContext(ScreenTimeContext);
  if (!context) {
    throw new Error('useScreenTime must be used within a ScreenTimeProvider');
  }
  return context;
}
