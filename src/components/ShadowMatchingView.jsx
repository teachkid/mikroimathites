import React, { useState } from 'react';
import { playPop, playFanfare, playChime, speakText } from '../utils/sound';
import confetti from 'canvas-confetti';
import { RotateCcw, Check, Award, ArrowRight } from 'lucide-react';

const SHADOW_ITEMS = [
  { id: 'elephant', name: 'Ελέφαντας', emoji: '🐘', distractors: ['🦁', '🦒'] },
  { id: 'butterfly', name: 'Πεταλούδα', emoji: '🦋', distractors: ['🐝', '🐞'] },
  { id: 'car', name: 'Αυτοκινητάκι', emoji: '🚗', distractors: ['🚀', '🚢'] },
  { id: 'apple', name: 'Μήλο', emoji: '🍎', distractors: ['🍌', '🍓'] },
  { id: 'rocket', name: 'Πύραυλος', emoji: '🚀', distractors: ['✈️', '🚁'] },
  { id: 'bear', name: 'Αρκουδάκι', emoji: '🐻', distractors: ['🐰', '🐱'] },
  { id: 'frog', name: 'Βάτραχος', emoji: '🐸', distractors: ['🐢', '🐟'] },
  { id: 'train', name: 'Τρένο', emoji: '🚂', distractors: ['🚌', '🚜'] },
];

export default function ShadowMatchingView({ onAddStar, soundEnabled }) {
  const [level, setLevel] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongChoice, setWrongChoice] = useState(null);

  const currentItem = SHADOW_ITEMS[level];

  // Mix correct item and distractors in a randomized list per level
  const [options, setOptions] = useState(() => {
    return [currentItem.emoji, ...currentItem.distractors].sort(() => Math.random() - 0.5);
  });

  const nextLevel = (newLevel = (level + 1) % SHADOW_ITEMS.length) => {
    setLevel(newLevel);
    setSolved(false);
    setWrongChoice(null);
    const nextItem = SHADOW_ITEMS[newLevel];
    setOptions([nextItem.emoji, ...nextItem.distractors].sort(() => Math.random() - 0.5));
  };

  const handleChoice = (emoji) => {
    playPop();
    if (emoji === currentItem.emoji) {
      // Correct!
      setSolved(true);
      playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onAddStar();
    } else {
      // Wrong
      setWrongChoice(emoji);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 animate-pop">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-3xl p-4 sm:p-6 border-4 border-emerald-200 shadow-md mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 flex items-center gap-2">
            <span>🧩 Ταίριαξε τις Σκιές</span>
          </h2>
          <p className="text-emerald-800 font-bold text-xs sm:text-sm">
            Ποιο ζωάκι ή αντικείμενο έχει αυτή τη σκιά;
          </p>
        </div>

        <div className="bg-emerald-100 border-2 border-emerald-300 px-4 py-1.5 rounded-2xl font-black text-emerald-900 text-sm">
          Επίπεδο {level + 1} από {SHADOW_ITEMS.length}
        </div>
      </div>

      {/* Main Shadow Arena */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-emerald-200 shadow-xl flex flex-col items-center mb-8">
        <span className="text-slate-500 font-bold text-sm mb-2">Η μυστική σκιά:</span>

        {/* Silhouette Box */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-amber-50 border-4 border-dashed border-emerald-300 flex items-center justify-center mb-6 shadow-inner">
          {solved ? (
            <span className="text-8xl sm:text-9xl animate-pop">{currentItem.emoji}</span>
          ) : (
            <span
              className="text-8xl sm:text-9xl select-none filter contrast-200 brightness-0 opacity-80"
              style={{ filter: 'brightness(0)' }}
            >
              {currentItem.emoji}
            </span>
          )}
        </div>

        {solved ? (
          <div className="text-center animate-pop">
            <h3 className="text-3xl font-black text-emerald-700 mb-1">
              ✨ {currentItem.name}!
            </h3>
            <p className="text-emerald-800 font-bold text-base mb-4">
              Το βρήκες τέλεια! Κέρδισες ένα αστέρι! ⭐
            </p>
            <button
              onClick={() => nextLevel()}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl kid-shadow-sm text-lg mx-auto"
            >
              <span>Επόμενη Σκιά</span>
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        ) : (
          <div>
            <p className="text-slate-700 font-bold text-center mb-4">
              👇 Διάλεξε το σωστό:
            </p>

            <div className="flex gap-4 sm:gap-6 justify-center">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(opt)}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-50 border-4 hover:border-emerald-400 shadow-md flex items-center justify-center text-6xl hover:scale-110 active:scale-95 transition-all ${
                    wrongChoice === opt ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                  }`}
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
