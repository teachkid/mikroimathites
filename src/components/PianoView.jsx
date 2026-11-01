import React, { useState, useEffect } from 'react';
import { playPianoNote, playFanfare, playPop, speakText } from '../utils/sound';
import { useAuth } from '../context/AuthContext';
import { useViewMode } from '../context/ViewModeContext';
import confetti from 'canvas-confetti';
import { Music, Award, RotateCcw, Sparkles, Keyboard } from 'lucide-react';

const PIANO_KEYS = [
  { note: 'ΝΤΟ', freq: 261.63, color: 'from-red-400 to-rose-500', shadow: 'border-red-600', keyName: 'C', keyShortcut: '1' },
  { note: 'ΡΕ', freq: 293.66, color: 'from-orange-400 to-amber-500', shadow: 'border-orange-600', keyName: 'D', keyShortcut: '2' },
  { note: 'ΜΙ', freq: 329.63, color: 'from-yellow-300 to-amber-400', shadow: 'border-yellow-600', keyName: 'E', keyShortcut: '3' },
  { note: 'ΦΑ', freq: 349.23, color: 'from-emerald-400 to-green-500', shadow: 'border-emerald-600', keyName: 'F', keyShortcut: '4' },
  { note: 'ΣΟΛ', freq: 392.00, color: 'from-cyan-400 to-teal-500', shadow: 'border-cyan-600', keyName: 'G', keyShortcut: '5' },
  { note: 'ΛΑ', freq: 440.00, color: 'from-blue-400 to-indigo-500', shadow: 'border-blue-600', keyName: 'A', keyShortcut: '6' },
  { note: 'ΣΙ', freq: 493.88, color: 'from-purple-400 to-indigo-600', shadow: 'border-purple-600', keyName: 'B', keyShortcut: '7' },
  { note: 'ΝΤΟ²', freq: 523.25, color: 'from-pink-400 to-rose-500', shadow: 'border-pink-600', keyName: 'C2', keyShortcut: '8' },
];

const SONGS = [
  {
    title: 'Φεγγαράκι μου λαμπρό 🌙',
    notes: [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0], // Ντο Ντο Σολ Σολ Λα Λα Σολ...
  },
  {
    title: 'Ωδή στη Χαρά (Μπετόβεν) 🎼',
    notes: [2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 2, 1, 1], // Μι Μι Φα Σολ Σολ Φα Μι Ρε Ντο Ντο Ρε Μι Μι Ρε Ρε
  },
  {
    title: 'Αστεράκι φωτεινό ⭐',
    notes: [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0],
  },
];

export default function PianoView({ onAddStar, soundEnabled }) {
  const { recordStat } = useAuth();
  const { effectiveMode } = useViewMode();
  const isPC = effectiveMode === 'pc';

  const [selectedSongIndex, setSelectedSongIndex] = useState(null);
  const [songStep, setSongStep] = useState(0);
  const [activeKey, setActiveKey] = useState(null);

  // PC Physical Keyboard support (Keys 1-8 or A-K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const keyMap = {
        '1': 0, 'a': 0, 'A': 0,
        '2': 1, 's': 1, 'S': 1,
        '3': 2, 'd': 2, 'D': 2,
        '4': 3, 'f': 3, 'F': 3,
        '5': 4, 'g': 4, 'G': 4,
        '6': 5, 'h': 5, 'H': 5,
        '7': 6, 'j': 6, 'J': 6,
        '8': 7, 'k': 7, 'K': 7,
      };
      if (keyMap[e.key] !== undefined) {
        handleKeyPress(keyMap[e.key]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSongIndex, songStep]);

  const handleKeyPress = (keyIndex) => {
    const keyData = PIANO_KEYS[keyIndex];
    playPianoNote(keyData.freq);
    setActiveKey(keyIndex);
    setTimeout(() => setActiveKey(null), 250);

    // If song mode active
    if (selectedSongIndex !== null) {
      const currentSong = SONGS[selectedSongIndex];
      const expectedKey = currentSong.notes[songStep];

      if (keyIndex === expectedKey) {
        const nextStep = songStep + 1;
        if (nextStep >= currentSong.notes.length) {
          // Song Completed!
          playFanfare();
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
          recordStat('song', 1);
          onAddStar();
          onAddStar();
          setSongStep(0);
        } else {
          setSongStep(nextStep);
        }
      }
    }
  };

  const handleSelectSong = (index) => {
    playPop();
    setSelectedSongIndex(index);
    setSongStep(0);
  };

  const handleExitSong = () => {
    playPop();
    setSelectedSongIndex(null);
    setSongStep(0);
  };

  const targetKeyIndex = selectedSongIndex !== null ? SONGS[selectedSongIndex].notes[songStep] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 animate-pop">
      {/* Header and Song Selector */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-4 border-amber-200 shadow-md mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950 flex items-center gap-2">
              <span>🎹 Μαγικό Παιδικό Πιάνο</span>
            </h2>
            <p className="text-amber-800 font-bold text-xs sm:text-sm">
              {selectedSongIndex !== null
                ? `Παίζουμε: ${SONGS[selectedSongIndex].title}`
                : 'Πάτησε τα πλήκτρα ή διάλεξε ένα τραγουδάκι για να μάθεις!'}
            </p>
          </div>

          {selectedSongIndex !== null && (
            <button
              onClick={handleExitSong}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-2xl text-sm"
            >
              Ελεύθερο Παιχνίδι 🎶
            </button>
          )}
        </div>

        {/* Songs List */}
        <div className="flex flex-wrap gap-2">
          {SONGS.map((song, idx) => (
            <button
              key={song.title}
              onClick={() => handleSelectSong(idx)}
              className={`px-4 py-2 rounded-2xl font-black text-sm transition-all ${
                selectedSongIndex === idx
                  ? 'bg-amber-500 text-white shadow-md scale-105'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              🎵 {song.title}
            </button>
          ))}
        </div>
      </div>

      {/* Target prompt in Song mode */}
      {selectedSongIndex !== null && (
        <div className="text-center mb-4 animate-bounce">
          <span className="bg-amber-300 text-amber-950 font-black px-6 py-2 rounded-full text-base sm:text-lg shadow-sm border-2 border-amber-400 inline-block">
            👉 Πάτησε το {PIANO_KEYS[targetKeyIndex].note}! (Βήμα {songStep + 1} από {SONGS[selectedSongIndex].notes.length})
          </span>
        </div>
      )}

      {/* Piano Keys Board */}
      <div className="bg-slate-900 p-2 sm:p-6 rounded-3xl shadow-2xl border-4 border-amber-300 flex justify-center items-end gap-1 sm:gap-3 min-h-[240px] sm:min-h-[380px] touch-none select-none overflow-hidden">
        {PIANO_KEYS.map((key, idx) => {
          const isTarget = targetKeyIndex === idx;
          const isPressed = activeKey === idx;

          return (
            <button
              key={key.note}
              onPointerDown={() => handleKeyPress(idx)}
              className={`relative flex-1 min-w-0 max-w-[85px] h-52 sm:h-80 rounded-xl sm:rounded-3xl bg-gradient-to-b ${
                key.color
              } flex flex-col justify-between items-center py-3 sm:py-4 text-white font-black transition-all transform active:scale-95 cursor-pointer border-b-6 sm:border-b-8 ${
                key.shadow
              } ${
                isTarget
                  ? 'scale-105 ring-3 sm:ring-4 ring-yellow-300 shadow-yellow-300/80 shadow-2xl animate-pulse z-10'
                  : ''
              } ${isPressed ? 'translate-y-2 border-b-2 brightness-110' : ''}`}
            >
              {/* Note Icon / Indicator */}
              <div className="text-xl sm:text-3xl">
                {isTarget ? '⭐' : '🎵'}
              </div>

              {/* Note Greek Name and Keyboard Shortcut */}
              <div className="text-center px-0.5">
                <span className="text-xs sm:text-2xl font-black block tracking-tight">
                  {key.note}
                </span>
                {isPC && (
                  <span className="inline-block mt-1 bg-black/30 backdrop-blur-xs text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.5 rounded-md border border-white/30 text-white/90">
                    [{key.keyShortcut}]
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* PC Keyboard hint */}
      {isPC && (
        <div className="mt-4 text-center text-xs font-bold text-amber-900/70 flex items-center justify-center gap-1.5">
          <Keyboard className="w-4 h-4 text-amber-700" />
          <span>Έκδοση Υπολογιστή: Παίξτε τις νότες με τα πλήκτρα <strong>1 έως 8</strong> στο πληκτρολόγιο!</span>
        </div>
      )}
    </div>
  );
}
