import React, { useState, useEffect } from 'react';
import { useViewMode } from '../context/ViewModeContext';
import { Monitor, Smartphone, RotateCw, Wifi, BatteryCharging, ArrowLeft } from 'lucide-react';
import { playPop } from '../utils/sound';

export default function MobileSimulatorWrapper({ children }) {
  const {
    effectiveMode,
    setViewMode,
    showMobileSimulator,
    phoneOrientation,
    setPhoneOrientation,
    windowWidth,
  } = useViewMode();

  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleOrientation = () => {
    playPop();
    setPhoneOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'));
  };

  // 1. MOBILE SIMULATOR ON DESKTOP SCREENS
  if (showMobileSimulator) {
    const isPortrait = phoneOrientation === 'portrait';
    const frameWidth = isPortrait ? 'w-[400px]' : 'w-[844px]';
    const frameHeight = isPortrait ? 'h-[844px] max-h-[calc(100vh-120px)]' : 'h-[440px] max-h-[calc(100vh-120px)]';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 flex flex-col items-center justify-start py-4 px-2 sm:px-4">
        {/* Desktop Helper Bar */}
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5 mb-4 flex flex-wrap items-center justify-between gap-3 text-white shadow-xl">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-sm">
              📱 Προβολή Κινητού (Mobile Simulator)
            </span>
            <span className="text-xs text-white/70 hidden sm:inline">
              {isPortrait ? 'Κάθετη όψη (Portrait • 400 × 844 px)' : 'Οριζόντια όψη (Landscape • 844 × 440 px)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Rotate Phone Button */}
            <button
              onClick={toggleOrientation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-bold transition-all cursor-pointer border border-white/20"
              title="Περιστροφή Συσκευής"
            >
              <RotateCw className="w-4 h-4" />
              <span>{isPortrait ? 'Οριζόντια' : 'Κάθετα'}</span>
            </button>

            {/* Switch back to PC full-width */}
            <button
              onClick={() => setViewMode('pc')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs active:scale-95 transition-all cursor-pointer shadow-md"
              title="Επιστροφή σε πλήρη οθόνη PC"
            >
              <Monitor className="w-4 h-4 stroke-[2.5]" />
              <span>Προβολή PC</span>
            </button>
          </div>
        </div>

        {/* Realistic Smartphone Shell */}
        <div
          className={`relative ${frameWidth} ${frameHeight} bg-slate-950 rounded-[48px] p-2 border-[10px] border-slate-900 shadow-[0_30px_70px_rgba(0,0,0,0.7)] flex flex-col transition-all duration-300 ring-2 ring-white/10`}
        >
          {/* Smartphone Status Bar with Integrated Dynamic Island */}
          <div className="h-8 w-full flex items-center justify-between px-5 text-[11px] font-bold text-slate-800 bg-white/95 rounded-t-[36px] select-none border-b border-amber-100 shrink-0">
            {/* Time */}
            <span className="font-black text-xs text-slate-900 pl-1">{currentTime}</span>

            {/* Dynamic Island Pill cleanly centered without overlapping content */}
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2 shadow-xs">
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800"></div>
              <div className="w-2 h-2 rounded-full bg-sky-950/80 border border-sky-800"></div>
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-slate-700 pr-1">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black text-slate-800">5G</span>
              <BatteryCharging className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          {/* Inner Phone Screen Content */}
          <div className="flex-1 w-full bg-white rounded-b-[36px] overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}

            {/* Bottom Home Indicator Bar */}
            <div className="sticky bottom-1 left-0 right-0 py-1 flex justify-center pointer-events-none z-50">
              <div className="w-28 h-1 bg-slate-900/40 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. PC MODE ON PHYSICAL MOBILE SCREENS (< 768px)
  if (effectiveMode === 'pc' && windowWidth < 768) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col">
        {/* Banner notifying user that PC mode is active on mobile */}
        <div className="sticky top-0 z-50 bg-amber-500 text-amber-950 px-3 py-1.5 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-1.5">
            <Monitor className="w-4 h-4 stroke-[2.5]" />
            <span>Έκδοση Υπολογιστή (PC Mode)</span>
          </div>
          <button
            onClick={() => setViewMode('mobile')}
            className="flex items-center gap-1 bg-white/90 hover:bg-white text-amber-950 px-2.5 py-1 rounded-xl text-[11px] font-black shadow-xs active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Κινητό</span>
          </button>
        </div>

        {/* Scrollable container displaying the desktop layout width */}
        <div className="w-full overflow-x-auto overflow-y-auto flex-1">
          <div className="min-w-[860px]">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // 3. NATIVE RESPONSIVE VIEW (Default: Full PC on desktop, Full Mobile on mobile)
  return <>{children}</>;
}
