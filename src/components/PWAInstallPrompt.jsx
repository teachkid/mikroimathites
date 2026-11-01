import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Share } from 'lucide-react';
import { playPop } from '../utils/sound';

export default function PWAInstallPrompt({ compact = false }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running as installed standalone PWA
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsStandalone(isStandaloneMode);

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (isStandalone) {
    return null; // Already installed, do not show button
  }

  const handleInstallClick = () => {
    playPop();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General fallback
      alert('Για εγκατάσταση, πατήστε το μενού του φυλλομετρητή (3 τελείες) και επιλέξτε «Εγκατάσταση εφαρμογής» ή «Προσθήκη στην αρχική οθόνη»!');
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-2xl kid-shadow-sm active:scale-95 transition-all cursor-pointer ${
          compact ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-xs sm:text-sm'
        }`}
        title="Εγκατάσταση της εφαρμογής στη συσκευή σου"
      >
        <Download className="w-4 h-4 stroke-[2.5] animate-bounce" />
        <span>Εγκατάσταση App</span>
      </button>

      {/* iOS Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-pop">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-2xl text-center">
            <button
              onClick={() => {
                playPop();
                setShowIOSGuide(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="text-4xl mb-2">📲</div>
            <h3 className="text-lg font-black text-amber-950 mb-3">
              Εγκατάσταση σε iPhone / iPad
            </h3>

            <div className="space-y-3 text-left text-xs font-bold text-slate-700 bg-amber-50 p-4 rounded-2xl border border-amber-200 mb-4">
              <div className="flex items-start gap-2.5">
                <span className="bg-amber-400 text-amber-950 rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-xs font-black">
                  1
                </span>
                <span>
                  Πατήστε το κουμπί <strong>Κοινοποίηση (Share)</strong> <Share className="w-3.5 h-3.5 inline text-sky-600" /> στο κάτω μέρος του Safari.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="bg-amber-400 text-amber-950 rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-xs font-black">
                  2
                </span>
                <span>
                  Κυλήστε προς τα κάτω και επιλέξτε <strong>«Προσθήκη στην οθόνη αφετηρίας» (Add to Home Screen)</strong> ➕.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="bg-amber-400 text-amber-950 rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-xs font-black">
                  3
                </span>
                <span>
                  Πατήστε <strong>«Προσθήκη»</strong> πάνω δεξιά. Έτοιμο!
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                playPop();
                setShowIOSGuide(false);
              }}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl kid-shadow-sm active:scale-95"
            >
              Το κατάλαβα! ✨
            </button>
          </div>
        </div>
      )}
    </>
  );
}
