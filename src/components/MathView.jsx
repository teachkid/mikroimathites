import React, { useState, useEffect } from 'react';
import { playPop, playFanfare, speakCheer } from '../utils/sound';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles } from 'lucide-react';

const MATH_ITEMS = [
  { emoji: '🍎', name: 'Μήλα' },
  { emoji: '⭐', name: 'Αστέρια' },
  { emoji: '🎈', name: 'Μπαλόνια' },
  { emoji: '🚗', name: 'Αυτοκινητάκια' },
  { emoji: '🍓', name: 'Φράουλες' },
  { emoji: '🐥', name: 'Παπάκια' },
  { emoji: '🍪', name: 'Μπισκοτάκια' },
];

export default function MathView({ onAddStar }) {
  const [operation, setOperation] = useState('add'); // 'add', 'sub', 'mul', 'div'
  const [maxRange, setMaxRange] = useState(10); // 5, 10, or 20
  const [num1, setNum1] = useState(2);
  const [num2, setNum2] = useState(3);
  const [item, setItem] = useState(MATH_ITEMS[0]);
  const [options, setOptions] = useState([4, 5, 6]);
  const [wrongChoice, setWrongChoice] = useState(null);
  const [solved, setSolved] = useState(false);

  // Generate new math problem based on operation and difficulty
  const generateProblem = (op = operation, max = maxRange) => {
    setWrongChoice(null);
    setSolved(false);

    const randomItem = MATH_ITEMS[Math.floor(Math.random() * MATH_ITEMS.length)];
    setItem(randomItem);

    let n1, n2, answer;

    if (op === 'add') {
      const half = Math.max(2, Math.floor(max / 2));
      n1 = Math.floor(Math.random() * half) + 1;
      n2 = Math.floor(Math.random() * half) + 1;
      answer = n1 + n2;
    } else if (op === 'sub') {
      // Subtraction: ensure n1 >= n2 so answer >= 0
      n1 = Math.floor(Math.random() * Math.max(3, max - 2)) + 2;
      n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
      answer = n1 - n2;
    } else if (op === 'mul') {
      // Multiplication: child friendly multipliers
      let factorLimit = 3;
      if (max === 10) factorLimit = 5;
      if (max === 20) factorLimit = 6;
      n1 = Math.floor(Math.random() * factorLimit) + 1;
      n2 = Math.floor(Math.random() * factorLimit) + 1;
      answer = n1 * n2;
    } else if (op === 'div') {
      // Clean division without remainder
      let maxAns = 4;
      let maxDiv = 3;
      if (max === 10) { maxAns = 5; maxDiv = 4; }
      if (max === 20) { maxAns = 6; maxDiv = 5; }

      const expectedAnswer = Math.floor(Math.random() * maxAns) + 1;
      n2 = Math.floor(Math.random() * (maxDiv - 1)) + 2; // divisor >= 2
      n1 = expectedAnswer * n2;
      answer = expectedAnswer;
    }

    setNum1(n1);
    setNum2(n2);

    // Create 3 answer options (1 correct, 2 unique distractors)
    const distractors = new Set();
    let attempts = 0;
    while (distractors.size < 2 && attempts < 30) {
      attempts++;
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
      const val = answer + delta;
      if (val >= 0 && val !== answer) {
        distractors.add(val);
      }
    }
    // Fallback if needed
    let fallback = 1;
    while (distractors.size < 2) {
      if (answer + fallback !== answer && !distractors.has(answer + fallback)) {
        distractors.add(answer + fallback);
      } else if (answer - fallback >= 0 && !distractors.has(answer - fallback)) {
        distractors.add(answer - fallback);
      }
      fallback++;
    }

    const opts = [answer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);
    setOptions(opts);
  };

  useEffect(() => {
    generateProblem(operation, maxRange);
  }, [operation, maxRange]);

  const getCorrectAnswer = () => {
    if (operation === 'add') return num1 + num2;
    if (operation === 'sub') return num1 - num2;
    if (operation === 'mul') return num1 * num2;
    if (operation === 'div') return Math.floor(num1 / num2);
    return 0;
  };

  const correctAnswer = getCorrectAnswer();

  const handleChoice = (val) => {
    playPop();
    if (val === correctAnswer) {
      setSolved(true);
      playFanfare();
      speakCheer();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onAddStar();
    } else {
      setWrongChoice(val);
    }
  };

  const getOpSymbol = () => {
    switch (operation) {
      case 'add': return '+';
      case 'sub': return '−';
      case 'mul': return '×';
      case 'div': return '÷';
      default: return '+';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 animate-pop">
      {/* Controls & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-3xl p-4 sm:p-6 border-4 border-teal-200 shadow-md mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-teal-950 flex items-center gap-2">
            <span>➕ Διασκεδαστικά Μαθηματικά</span>
          </h2>
          <p className="text-teal-800 font-bold text-xs sm:text-sm mt-1">
            {operation === 'add' && 'Πρόσθεσε τα αντικείμενα και βρες το άθροισμα!'}
            {operation === 'sub' && 'Αφαίρεσε τα αντικείμενα και βρες πόσα μένουν!'}
            {operation === 'mul' && 'Μέτρησε τις ομάδες αντικειμένων και βρες το γινόμενο!'}
            {operation === 'div' && 'Μοίρασε τα αντικείμενα ισόποσα και βρες το πηλίκο!'}
          </p>
        </div>

        {/* Operation & Range Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 4 Operations toggle */}
          <div className="flex bg-teal-50 p-1 rounded-2xl border border-teal-200 gap-1 flex-wrap">
            <button
              onClick={() => {
                playPop();
                setOperation('add');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                operation === 'add' ? 'bg-teal-500 text-white shadow-sm' : 'text-teal-800 hover:bg-teal-100'
              }`}
            >
              ➕ Πρόσθεση
            </button>
            <button
              onClick={() => {
                playPop();
                setOperation('sub');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                operation === 'sub' ? 'bg-teal-500 text-white shadow-sm' : 'text-teal-800 hover:bg-teal-100'
              }`}
            >
              ➖ Αφαίρεση
            </button>
            <button
              onClick={() => {
                playPop();
                setOperation('mul');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                operation === 'mul' ? 'bg-teal-500 text-white shadow-sm' : 'text-teal-800 hover:bg-teal-100'
              }`}
            >
              ✖️ Πολλαπλασιασμός
            </button>
            <button
              onClick={() => {
                playPop();
                setOperation('div');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                operation === 'div' ? 'bg-teal-500 text-white shadow-sm' : 'text-teal-800 hover:bg-teal-100'
              }`}
            >
              ➗ Διαίρεση
            </button>
          </div>

          {/* Difficulty range */}
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            {[5, 10, 20].map((r) => (
              <button
                key={r}
                onClick={() => {
                  playPop();
                  setMaxRange(r);
                }}
                className={`px-2.5 py-1.5 rounded-xl font-black text-xs transition-all ${
                  maxRange === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                έως {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Math Arena */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-teal-200 shadow-xl flex flex-col items-center mb-6">
        {/* Math Equation Formula */}
        <div className="flex items-center justify-center gap-2 sm:gap-5 text-4xl sm:text-6xl font-black text-slate-800 font-bubble mb-6">
          <span className="w-14 h-14 sm:w-20 sm:h-20 bg-teal-50 border-3 border-teal-300 rounded-3xl flex items-center justify-center text-teal-800 shadow-inner">
            {num1}
          </span>

          <span className="text-teal-600 font-black text-3xl sm:text-5xl">
            {getOpSymbol()}
          </span>

          <span className="w-14 h-14 sm:w-20 sm:h-20 bg-teal-50 border-3 border-teal-300 rounded-3xl flex items-center justify-center text-teal-800 shadow-inner">
            {num2}
          </span>

          <span className="text-slate-400">=</span>

          <span className={`w-14 h-14 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center border-4 ${
            solved
              ? 'bg-emerald-100 border-emerald-400 text-emerald-800 animate-pop'
              : 'bg-amber-50 border-dashed border-amber-400 text-amber-600'
          }`}>
            {solved ? correctAnswer : '?'}
          </span>
        </div>

        {/* Visual Item Board customized per Operation */}
        <div className="w-full max-w-2xl bg-gradient-to-r from-teal-50/80 via-emerald-50/80 to-teal-50/80 rounded-3xl p-4 sm:p-6 border-2 border-teal-100 mb-8 shadow-sm">
          {/* Addition & Subtraction visual board */}
          {(operation === 'add' || operation === 'sub') && (
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
              {/* Left group */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[180px]">
                {Array.from({ length: num1 }).map((_, i) => (
                  <span key={i} className="text-3xl sm:text-4xl animate-bounce" style={{ animationDelay: `${i * 80}ms` }}>
                    {item.emoji}
                  </span>
                ))}
              </div>

              {/* Center icon */}
              <div className="w-10 h-10 rounded-full bg-teal-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                {getOpSymbol()}
              </div>

              {/* Right group */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[180px]">
                {Array.from({ length: num2 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-3xl sm:text-4xl ${operation === 'sub' ? 'opacity-30 line-through' : 'animate-bounce'}`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {item.emoji}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Multiplication visual board: num1 groups of num2 items */}
          {operation === 'mul' && (
            <div>
              <p className="text-center font-bold text-teal-900 text-sm mb-3">
                👀 {num1} {num1 === 1 ? 'ομάδα' : 'ομάδες'} με {num2} {item.name} η καθεμία:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {Array.from({ length: num1 }).map((_, groupIdx) => (
                  <div
                    key={groupIdx}
                    className="flex flex-wrap items-center justify-center gap-1.5 bg-white/90 p-2.5 sm:p-3 rounded-2xl border-2 border-teal-300 shadow-sm"
                  >
                    {Array.from({ length: num2 }).map((_, itemIdx) => (
                      <span key={itemIdx} className="text-2xl sm:text-3xl animate-bounce" style={{ animationDelay: `${(groupIdx * num2 + itemIdx) * 60}ms` }}>
                        {item.emoji}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Division visual board: num1 items shared into num2 equal groups */}
          {operation === 'div' && (
            <div>
              <p className="text-center font-bold text-teal-900 text-sm mb-3">
                👀 Μοιράζουμε {num1} {item.name} σε {num2} ίσες ομάδες:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {Array.from({ length: num2 }).map((_, groupIdx) => (
                  <div
                    key={groupIdx}
                    className="flex flex-col items-center bg-white/90 p-3 rounded-2xl border-2 border-teal-300 shadow-sm min-w-[90px]"
                  >
                    <span className="text-xs font-bold text-teal-700 mb-1">Ομάδα {groupIdx + 1}</span>
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {Array.from({ length: correctAnswer }).map((_, itemIdx) => (
                        <span key={itemIdx} className="text-2xl sm:text-3xl animate-bounce" style={{ animationDelay: `${(groupIdx * correctAnswer + itemIdx) * 60}ms` }}>
                          {item.emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-teal-700 font-bold mt-2">
                Πόσα {item.name} έχει η κάθε ομάδα;
              </p>
            </div>
          )}
        </div>

        {/* Answer choices or Next problem prompt */}
        {solved ? (
          <div className="text-center animate-pop">
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 mb-2">
              🎉 Σωστά! {num1} {getOpSymbol()} {num2} = {correctAnswer}!
            </h3>
            <p className="text-sm font-bold text-slate-600 mb-4">
              Κέρδισες ένα αστέρι! ⭐
            </p>
            <button
              onClick={() => generateProblem()}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-8 py-3.5 rounded-2xl kid-shadow-sm text-lg mx-auto"
            >
              <span>Επόμενη Πράξη</span>
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        ) : (
          <div className="w-full">
            <p className="text-slate-600 font-bold text-center mb-4 text-base">
              👇 Διάλεξε το σωστό αποτέλεσμα:
            </p>

            <div className="flex justify-center gap-3 sm:gap-6">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleChoice(opt)}
                  className={`w-20 h-20 sm:w-28 sm:h-28 rounded-3xl font-black text-3xl sm:text-4xl flex items-center justify-center border-4 transition-all transform hover:scale-105 active:scale-95 shadow-md ${
                    wrongChoice === opt
                      ? 'border-rose-400 bg-rose-50 text-rose-600 animate-wiggle'
                      : 'border-teal-300 bg-white hover:bg-teal-50 text-teal-900'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
