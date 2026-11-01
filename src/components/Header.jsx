import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize, Minimize, ArrowLeft, Star, User, Settings, Trophy, Lightbulb } from 'lucide-react';
import { playPop } from '../utils/sound';
import { useAuth } from '../context/AuthContext';

export default function Header({
  currentScreen,
  onGoHome,
  soundEnabled,
  onToggleSound,
  onOpenAuth,
  onOpenParentZone,
  onOpenScoreboard,
  onOpenShop,
  onOpenFeedback,
}) {
  const { currentUser, activeChild, isGuest } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(true);

  useEffect(() => {
    const hasFs = !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.documentElement.requestFullscreen ||
      document.documentElement.webkitRequestFullscreen
    );
    setCanFullscreen(hasFs);

    const handleFsChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    playPop();
    try {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    } catch (e) {
      console.warn('Fullscreen not allowed:', e);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-4 border-amber-300 px-2 sm:px-6 py-1.5 sm:py-2.5 shadow-md pt-[max(0.5rem,env(safe-area-inset-top))]">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-1 sm:gap-2">
        {/* Left Side: Home or Back Button */}
        <div className="flex items-center gap-1 sm:gap-2">
          {currentScreen !== 'home' ? (
            <button
              onClick={() => {
                playPop();
                onGoHome();
              }}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-amber-950 font-black px-3.5 py-2 sm:px-4 sm:py-2 rounded-2xl kid-shadow-sm kid-shadow-active transition-all text-sm sm:text-base min-h-[42px]"
              title="Επιστροφή στην αρχική"
            >
              <ArrowLeft className="w-5 h-5 stroke-[3]" />
              <span className="hidden xs:inline">Αρχική</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl animate-bounce">🎈</span>
              <div>
                <h1 className="text-base sm:text-xl font-black text-amber-900 tracking-tight leading-tight">
                  Μικροί Μαθητές
                </h1>
                <p className="text-[10px] sm:text-xs text-amber-700 font-bold hidden sm:block">
                  Μαθαίνω παίζοντας & διασκεδάζοντας!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Center / Right: Child Profile Pill, Trophy, Stars & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Active Child Profile Badge */}
          <button
            onClick={() => {
              playPop();
              if (isGuest) {
                onOpenAuth();
              } else {
                onOpenParentZone();
              }
            }}
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-2xl kid-shadow-sm transition-all"
            title="Προφίλ Παιδιού / Ζώνη Γονέα"
          >
            <span className="text-xl sm:text-2xl">{activeChild?.avatar || '🦁'}</span>
            <div className="text-left hidden sm:block">
              <span className="block text-xs font-black text-amber-950 leading-tight">
                {activeChild?.name || 'Μαθητής'}
              </span>
              <span className="block text-[10px] font-bold text-amber-700">
                {isGuest ? 'Επισκέπτης' : 'Αποθηκεύτηκε'}
              </span>
            </div>
          </button>

          {/* Trophy Scoreboard Button */}
          <button
            onClick={() => {
              playPop();
              onOpenScoreboard();
            }}
            className="flex items-center gap-1 bg-gradient-to-r from-yellow-300 to-amber-400 hover:from-yellow-400 hover:to-amber-500 text-amber-950 font-black px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-2xl border-2 border-amber-500 kid-shadow-sm transition-all active:scale-95"
            title="Πίνακας Πρωταθλητών (Scoreboard)"
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-900" />
            <span className="text-xs font-black hidden md:inline">Top</span>
          </button>

          {/* Star Shop Button */}
          <button
            onClick={() => {
              playPop();
              onOpenShop();
            }}
            className="flex items-center gap-1 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-black px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-2xl border-2 border-pink-300 kid-shadow-sm transition-all active:scale-95"
            title="Μαγικό Κατάστημα (Star Shop)"
          >
            <span className="text-base sm:text-lg">🛍️</span>
            <span className="text-xs font-black hidden md:inline">Shop</span>
          </button>

          {/* Star Counter */}
          <div className="flex items-center gap-1 bg-yellow-100 border-2 border-yellow-400 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-2xl kid-shadow-sm">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="font-black text-amber-900 text-base sm:text-lg">
              {activeChild?.stars || 0}
            </span>
          </div>

          {/* Parent Zone / Login Button */}
          {isGuest ? (
            <button
              onClick={() => {
                playPop();
                onOpenAuth();
              }}
              className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl kid-shadow-sm text-xs sm:text-sm transition-all"
            >
              <User className="w-4 h-4" />
              <span className="hidden xs:inline">Σύνδεση</span>
            </button>
          ) : (
            <button
              onClick={() => {
                playPop();
                onOpenParentZone();
              }}
              className="p-2 sm:px-3 sm:py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-2xl border-2 border-purple-300 kid-shadow-sm transition-all flex items-center gap-1"
              title="Ζώνη Γονέα"
            >
              <Settings className="w-4 h-4" />
              <span className="text-xs font-black hidden md:inline">Γονείς</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => {
              playPop();
              onToggleSound();
            }}
            className="p-2 bg-sky-100 hover:bg-sky-200 active:bg-sky-300 text-sky-800 rounded-2xl border-2 border-sky-300 kid-shadow-sm transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
            title={soundEnabled ? 'Σίγαση' : 'Ενεργοποίηση Ήχου'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 stroke-[2.5]" />
            )}
          </button>

          {/* Feedback & Ideas Button */}
          {onOpenFeedback && (
            <button
              onClick={() => {
                playPop();
                onOpenFeedback();
              }}
              className="p-2 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 rounded-2xl border-2 border-amber-200 kid-shadow-sm transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Πρότεινε Ιδέα ή Ανάφερε Πρόβλημα"
            >
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 stroke-[2.5]" />
            </button>
          )}

          {/* Fullscreen (if supported) */}
          {canFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300 text-emerald-800 rounded-2xl border-2 border-emerald-300 kid-shadow-sm transition-all min-h-[40px] min-w-[40px] flex items-center justify-center hidden sm:flex"
              title="Πλήρης Οθόνη"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              ) : (
                <Maximize className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
