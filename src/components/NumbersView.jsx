import React, { useState, useEffect } from 'react';
import { NUMBERS_DATA } from '../data/numbers';
import { speakText, playPop, playFanfare } from '../utils/sound';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, Volume2, RotateCcw } from 'lucide-react';

const GREEK_NUMBERS = [
  'Μηδέν', 'Ένα', 'Δύο', 'Τρία', 'Τέσσερα', 'Πέντε',
  'Έξι', 'Επτά', 'Οκτώ', 'Εννέα', 'Δέκα',
  'Έντεκα', 'Δώδεκα', 'Δεκατρία', 'Δεκατέσσερα', 'Δεκαπέντε',
  'Δεκαέξι', 'Δεκαεπτά', 'Δεκαοκτώ', 'Δεκαεννέα', 'Είκοσι',
  'Είκοσι ένα', 'Είκοσι δύο', 'Είκοσι τρία', 'Είκοσι τέσσερα', 'Είκοσι πέντε'
];

export default function NumbersView({ onAddStar, soundEnabled }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tappedIndices, setTappedIndices] = useState(new Set());

  const current = NUMBERS_DATA[selectedIndex];

  useEffect(() => {
    setTappedIndices(new Set());
  }, [selectedIndex]);

  const handleTapItem = (idx) => {
    if (tappedIndices.has(idx)) return;

    playPop();
    const newTapped = new Set(tappedIndices);
    newTapped.add(idx);
    setTappedIndices(newTapped);

    const count = newTapped.size;
    if (soundEnabled && GREEK_NUMBERS[count]) {
      speakText(`${GREEK_NUMBERS[count]}!`);
    }

    // Finished counting all items!
    if (count === current.number) {
      setTimeout(() => {
        playFanfare();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
        onAddStar();
      }, 400);
    }
  };

  const handleResetCount = () => {
    playPop();
    setTappedIndices(new Set());
  };

  const isLargeCount = current.number > 12;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-pop">
      {/* Numbers quick-selector bar */}
      <div className="flex gap-2 overflow-x-auto pb-4 pt-1 px-2 no-scrollbar">
        {NUMBERS_DATA.map((item, idx) => (
          <button
            key={item.number}
            onClick={() => {
              playPop();
              setSelectedIndex(idx);
            }}
            className={`flex-shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center transition-all ${
              idx === selectedIndex
                ? 'bg-amber-400 text-amber-950 scale-110 shadow-lg border-3 border-amber-500'
                : 'bg-white text-slate-700 hover:bg-amber-100 border-2 border-slate-200'
            }`}
          >
            {item.number}
          </button>
        ))}
      </div>

      {/* Main Number Board */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-amber-200 shadow-xl flex flex-col items-center my-4">
        {/* Big Number and Word */}
        <div className="flex items-center gap-6 mb-6">
          <div className="text-7xl sm:text-9xl font-black text-amber-500 font-bubble drop-shadow">
            {current.number}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-4xl font-black text-slate-800">
                « {current.name} »
              </span>
              {soundEnabled && (
                <button
                  onClick={() => speakText(current.name)}
                  className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                  title="Άκουσε τον αριθμό"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <span className="text-sm sm:text-base text-amber-800 font-bold block mt-1">
              {tappedIndices.size} από {current.number} {current.itemName} μετρήθηκαν
            </span>
          </div>
        </div>

        {/* Interactive Counting Area */}
        <p className="text-slate-600 font-bold mb-4 text-center text-sm sm:text-base">
          👇 Πάτησε ένα-ένα τα {current.itemName} για να μετρήσεις:
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 min-h-[160px] max-w-2xl p-4 bg-amber-50/60 rounded-3xl border-2 border-amber-100">
          {Array.from({ length: current.number }).map((_, idx) => {
            const isTapped = tappedIndices.has(idx);
            return (
              <button
                key={idx}
                onClick={() => handleTapItem(idx)}
                className={`relative rounded-2xl flex items-center justify-center transition-all transform active:scale-90 ${
                  isLargeCount
                    ? 'w-14 h-14 sm:w-16 sm:h-16 text-3xl sm:text-4xl'
                    : 'w-18 h-18 sm:w-22 sm:h-22 text-4xl sm:text-5xl'
                } ${
                  isTapped
                    ? 'bg-amber-300 scale-105 shadow-md border-3 border-amber-500 animate-wiggle'
                    : 'bg-white hover:bg-amber-100 shadow-sm border-2 border-slate-200'
                }`}
              >
                <span>{current.itemEmoji}</span>
                {isTapped && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Reset button */}
        <button
          onClick={handleResetCount}
          className="mt-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Μέτρησε ξανά από την αρχή</span>
        </button>
      </div>

      {/* Prev / Next Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => {
            playPop();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : NUMBERS_DATA.length - 1));
          }}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-5 py-3 rounded-2xl kid-shadow-sm kid-shadow-active text-base sm:text-lg"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
          <span>Προηγούμενο</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setSelectedIndex((prev) => (prev < NUMBERS_DATA.length - 1 ? prev + 1 : 0));
          }}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-5 py-3 rounded-2xl kid-shadow-sm kid-shadow-active text-base sm:text-lg"
        >
          <span>Επόμενο</span>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
