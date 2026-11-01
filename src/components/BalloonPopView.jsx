import React, { useState, useEffect, useRef } from 'react';
import { playPop, playFanfare, playChime, speakText } from '../utils/sound';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { RotateCcw, Award, Play } from 'lucide-react';

const BALLOON_COLORS = [
  { name: 'Κόκκινο', bg: 'bg-red-500', border: 'border-red-600', text: 'text-white' },
  { name: 'Μπλε', bg: 'bg-blue-500', border: 'border-blue-600', text: 'text-white' },
  { name: 'Κίτρινο', bg: 'bg-yellow-400', border: 'border-yellow-500', text: 'text-slate-900' },
  { name: 'Πράσινο', bg: 'bg-emerald-500', border: 'border-emerald-600', text: 'text-white' },
  { name: 'Μωβ', bg: 'bg-purple-500', border: 'border-purple-600', text: 'text-white' },
  { name: 'Ροζ', bg: 'bg-pink-500', border: 'border-pink-600', text: 'text-white' },
];

export default function BalloonPopView({ onAddStar, soundEnabled }) {
  const { recordStat } = useAuth();
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [targetColor, setTargetColor] = useState(null); // optional color target
  const nextId = useRef(0);

  // Spawn balloons periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length >= 7) return prev; // Keep reasonable density for small kids

        const colorObj = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
        const leftPercent = Math.floor(Math.random() * 75) + 10; // 10% to 85%
        const speed = Math.random() * 1.5 + 2.5; // gentle speed (2.5s to 4s)

        return [
          ...prev,
          {
            id: nextId.current++,
            color: colorObj,
            left: leftPercent,
            speed: speed,
            label: Math.floor(Math.random() * 9) + 1, // numbers 1-9
          },
        ];
      });
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  const handlePopBalloon = (id, balloonColor) => {
    playPop();

    // Remove popped balloon
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    const newScore = score + 1;
    setScore(newScore);
    recordStat('balloon', newScore);

    // Every 10 pops -> Reward star!
    if (newScore % 10 === 0) {
      playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
      });
      onAddStar();
    }
  };

  const handleResetScore = () => {
    playPop();
    setScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 animate-pop">
      {/* Header and Score */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-3xl p-4 sm:p-6 border-4 border-sky-200 shadow-md mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-sky-950 flex items-center gap-2">
            <span>🎈 Σπάσε τα Μπαλόνια!</span>
          </h2>
          <p className="text-sky-800 font-bold text-xs sm:text-sm">
            Πάτησε τα μπαλόνια που πετάνε ψηλά για να τα σκάσεις!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-sky-100 border-2 border-sky-300 px-4 py-2 rounded-2xl flex items-center gap-2">
            <span className="text-sm font-bold text-sky-800">Σκορ:</span>
            <span className="text-2xl font-black text-sky-950">{score}</span>
          </div>

          <button
            onClick={handleResetScore}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl"
            title="Επαναφορά σκορ"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sky Canvas / Balloon Flight Arena */}
      <div className="relative w-full h-[450px] sm:h-[520px] rounded-3xl bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100 border-4 border-sky-300 shadow-xl overflow-hidden touch-none select-none">
        {/* Fluffy clouds background */}
        <div className="absolute top-8 left-10 text-6xl opacity-70 pointer-events-none animate-pulse">
          ☁️
        </div>
        <div className="absolute top-20 right-14 text-7xl opacity-80 pointer-events-none animate-pulse">
          ☁️
        </div>
        <div className="absolute top-48 left-1/3 text-5xl opacity-60 pointer-events-none">
          ☁️
        </div>

        {/* Floating Balloons */}
        {balloons.map((balloon) => (
          <button
            key={balloon.id}
            onPointerDown={() => handlePopBalloon(balloon.id, balloon.color)}
            className={`absolute bottom-[-100px] w-20 h-28 sm:w-24 sm:h-32 rounded-full ${balloon.color.bg} border-4 ${balloon.color.border} shadow-lg flex flex-col items-center justify-center transform active:scale-125 transition-transform cursor-pointer`}
            style={{
              left: `${balloon.left}%`,
              animation: `floatUp ${balloon.speed}s linear infinite`,
            }}
          >
            {/* Balloon string & highlight */}
            <div className="absolute top-3 left-4 w-4 h-6 bg-white/40 rounded-full rotate-12 pointer-events-none" />
            <span className={`text-2xl sm:text-3xl font-black ${balloon.color.text}`}>
              {balloon.label}
            </span>
            {/* Knot */}
            <div className={`absolute -bottom-2 w-3 h-3 ${balloon.color.bg} rotate-45 border-2 ${balloon.color.border}`} />
          </button>
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.9);
            opacity: 0.95;
          }
          100% {
            transform: translateY(-620px) scale(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
