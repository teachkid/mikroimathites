import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeMenu from './components/HomeMenu';
import AlphabetView from './components/AlphabetView';
import NumbersView from './components/NumbersView';
import MathView from './components/MathView';
import ColorsShapesView from './components/ColorsShapesView';
import AnimalsView from './components/AnimalsView';
import MemoryGameView from './components/MemoryGameView';
import DrawingPadView from './components/DrawingPadView';
import PianoView from './components/PianoView';
import BalloonPopView from './components/BalloonPopView';
import ShadowMatchingView from './components/ShadowMatchingView';
import StickerAlbumView from './components/StickerAlbumView';
import AuthModal from './components/AuthModal';
import ParentZoneModal from './components/ParentZoneModal';
import ScoreboardModal from './components/ScoreboardModal';
import StarShopModal from './components/StarShopModal';
import FeedbackModal from './components/FeedbackModal';
import PrintablesModal from './components/PrintablesModal';
import BreakTimeModal from './components/BreakTimeModal';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ViewModeProvider } from './context/ViewModeContext';
import { ScreenTimeProvider } from './context/ScreenTimeContext';
import MobileSimulatorWrapper from './components/MobileSimulatorWrapper';
import { setSoundMuted } from './utils/sound';

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('mikroi_mathites_sound');
      const isEnabled = saved !== 'false';
      setSoundMuted(!isEnabled);
      return isEnabled;
    } catch (e) {
      return true;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isParentZoneOpen, setIsParentZoneOpen] = useState(false);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isPrintablesOpen, setIsPrintablesOpen] = useState(false);

  const { activeChild, addStarToActiveChild } = useAuth();

  // Keyboard navigation for desktop PC users (Escape returns Home)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCurrentScreen('home');
        setIsAuthOpen(false);
        setIsParentZoneOpen(false);
        setIsPrintablesOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      setSoundMuted(!next);
      try {
        localStorage.setItem('mikroi_mathites_sound', String(next));
      } catch (e) {}
      return next;
    });
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col justify-between selection:bg-amber-300">
      <div>
        <Header
          currentScreen={currentScreen}
          onGoHome={handleGoHome}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenParentZone={() => setIsParentZoneOpen(true)}
          onOpenScoreboard={() => setIsScoreboardOpen(true)}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
          onOpenPrintables={() => setIsPrintablesOpen(true)}
        />

        <main className="pb-8 sm:pb-12">
          {currentScreen === 'home' && (
            <HomeMenu
              onSelectCategory={(catId) => {
                if (catId === 'scoreboard') {
                  setIsScoreboardOpen(true);
                } else if (catId === 'shop') {
                  setIsShopOpen(true);
                } else if (catId === 'printables') {
                  setIsPrintablesOpen(true);
                } else {
                  setCurrentScreen(catId);
                }
              }}
              onOpenPrintables={() => setIsPrintablesOpen(true)}
              soundEnabled={soundEnabled}
            />
          )}

          {currentScreen === 'alphabet' && (
            <AlphabetView
              onAddStar={addStarToActiveChild}
              soundEnabled={soundEnabled}
            />
          )}

          {currentScreen === 'numbers' && (
            <NumbersView
              onAddStar={addStarToActiveChild}
              soundEnabled={soundEnabled}
            />
          )}

          {currentScreen === 'math' && (
            <MathView
              onAddStar={addStarToActiveChild}
            />
          )}

          {currentScreen === 'piano' && (
            <PianoView
              onAddStar={addStarToActiveChild}
              soundEnabled={soundEnabled}
            />
          )}

          {currentScreen === 'balloons' && (
            <BalloonPopView
              onAddStar={addStarToActiveChild}
              soundEnabled={soundEnabled}
            />
          )}

          {currentScreen === 'shadows' && (
            <ShadowMatchingView
              onAddStar={addStarToActiveChild}
              soundEnabled={soundEnabled}
            />
          )}

          {currentScreen === 'colors-shapes' && (
            <ColorsShapesView
              onAddStar={addStarToActiveChild}
              soundEnabled={soundEnabled}
            />
          )}

          {currentScreen === 'animals' && (
            <AnimalsView
              onAddStar={addStarToActiveChild}
              soundEnabled={soundEnabled}
            />
          )}

          {currentScreen === 'memory' && (
            <MemoryGameView
              onAddStar={addStarToActiveChild}
              soundEnabled={soundEnabled}
            />
          )}

          {currentScreen === 'stickers' && (
            <StickerAlbumView
              stars={activeChild?.stars || 0}
              soundEnabled={soundEnabled}
            />
          )}

          {currentScreen === 'drawing' && (
            <DrawingPadView
              onAddStar={addStarToActiveChild}
              soundEnabled={soundEnabled}
            />
          )}
        </main>
      </div>

      {/* Auth Modal (Login & Register) */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Parent Zone Modal (Child Lock, Profiles & Screen Time) */}
      <ParentZoneModal
        isOpen={isParentZoneOpen}
        onClose={() => setIsParentZoneOpen(false)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenPrintables={() => setIsPrintablesOpen(true)}
      />

      {/* Scoreboard & Achievements Modal */}
      <ScoreboardModal
        isOpen={isScoreboardOpen}
        onClose={() => setIsScoreboardOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Star Shop Modal */}
      <StarShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
      />

      {/* Feedback & Bug Reporting Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Printables Modal */}
      <PrintablesModal
        isOpen={isPrintablesOpen}
        onClose={() => setIsPrintablesOpen(false)}
      />

      {/* Screen Time Limit Break Modal */}
      <BreakTimeModal />

      {/* Cross-Platform Footer with Safe Area Bottom Padding */}
      <footer className="text-center py-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-xs sm:text-sm text-amber-900/70 font-bold border-t border-amber-200/60 bg-amber-50/60">
        <p>
          🎈 <strong>Μικροί Μαθητές</strong> • Εκπαιδευτική εφαρμογή για PC, Mac, iPad, Android & iPhone
        </p>
        <p className="text-[11px] text-amber-800/60 mt-0.5">
          💡 Σε κινητό ή tablet: Πάτησε «Εγκατάσταση App» για εμπειρία πλήρους οθόνης ακόμη και χωρίς ίντερνετ (Offline)!
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallPrompt compact />

          {/* Printable Worksheets Button */}
          <button
            onClick={() => setIsPrintablesOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-200/90 hover:bg-amber-300 text-amber-950 text-xs font-black transition-all active:scale-95 shadow-xs cursor-pointer border border-amber-300"
          >
            <span>🖨️ Εκτυπώσιμα Φύλλα</span>
          </button>

          {/* Feedback & Bug Button */}
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-black transition-all active:scale-95 shadow-xs cursor-pointer border border-slate-300"
          >
            <span>💡 Ιδέες / Bugs</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScreenTimeProvider>
        <ViewModeProvider>
          <MobileSimulatorWrapper>
            <MainApp />
          </MobileSimulatorWrapper>
        </ViewModeProvider>
      </ScreenTimeProvider>
    </AuthProvider>
  );
}
