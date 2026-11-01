import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { useViewMode } from '../context/ViewModeContext';

export default function ViewModeSwitcher({ compact = false }) {
  const { effectiveMode, setViewMode } = useViewMode();

  return (
    <div
      className="inline-flex items-center bg-slate-100/90 hover:bg-slate-200/90 p-0.5 sm:p-1 rounded-2xl border-2 border-slate-300 kid-shadow-sm transition-all"
      role="group"
      aria-label="Επιλογή Έκδοσης (PC ή Κινητό)"
    >
      {/* PC Button */}
      <button
        onClick={() => setViewMode('pc')}
        className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl text-xs sm:text-xs font-black transition-all cursor-pointer ${
          effectiveMode === 'pc'
            ? 'bg-amber-400 text-amber-950 shadow-xs scale-102 border border-amber-500'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Έκδοση Υπολογιστή (PC / Desktop)"
      >
        <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        {!compact && <span className="hidden xs:inline">PC</span>}
      </button>

      {/* Mobile Button */}
      <button
        onClick={() => setViewMode('mobile')}
        className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl text-xs sm:text-xs font-black transition-all cursor-pointer ${
          effectiveMode === 'mobile'
            ? 'bg-amber-400 text-amber-950 shadow-xs scale-102 border border-amber-500'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Έκδοση Κινητού (Mobile / Smartphone)"
      >
        <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        {!compact && <span className="hidden xs:inline">Κινητό</span>}
      </button>
    </div>
  );
}
