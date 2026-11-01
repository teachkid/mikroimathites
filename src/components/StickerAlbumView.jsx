import React, { useState } from 'react';
import { playPop, playFanfare, speakText } from '../utils/sound';
import confetti from 'canvas-confetti';
import { RotateCcw, Download, Sparkles, Image as ImageIcon } from 'lucide-react';

const SCENES = [
  {
    id: 'sea',
    name: '🌊 Βυθός της Θάλασσας',
    bg: 'from-cyan-400 via-sky-500 to-blue-700',
    availableStickers: ['🐬', '🐠', '🐙', '🦀', '🦈', '🪸', '⭐', '🫧'],
  },
  {
    id: 'farm',
    name: '🚜 Η Φάρμα μας',
    bg: 'from-amber-200 via-emerald-200 to-green-600',
    availableStickers: ['🐮', '🐷', '🐑', '🐔', '🐴', '🚜', '🌻', '🍎'],
  },
  {
    id: 'space',
    name: '🚀 Το Διάστημα',
    bg: 'from-slate-900 via-purple-900 to-indigo-950',
    availableStickers: ['🚀', '🛸', '👨‍🚀', '🪐', '🌙', '⭐', '☄️', '👾'],
  },
  {
    id: 'island',
    name: '⛪ Ελληνικό Τοπίο',
    bg: 'from-sky-300 via-blue-400 to-indigo-600',
    availableStickers: ['⛪', '🕊️', '⛵', '☀️', '🌸', '🫒', '🐬', '🕯️'],
  },
];

export default function StickerAlbumView({ stars, soundEnabled }) {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [placedStickers, setPlacedStickers] = useState([]);
  const [activeSticker, setActiveSticker] = useState(null);

  const currentScene = SCENES[selectedSceneIndex];

  const handleSceneClick = (e) => {
    if (!activeSticker) return;

    playPop();
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setPlacedStickers((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        emoji: activeSticker,
        x: Math.max(5, Math.min(90, x)),
        y: Math.max(5, Math.min(85, y)),
      },
    ]);
  };

  const handleClear = () => {
    playPop();
    setPlacedStickers([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 animate-pop">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-3xl p-4 sm:p-6 border-4 border-purple-200 shadow-md mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-purple-950 flex items-center gap-2">
            <span>📖 Άλμπουμ με Αυτοκόλλητα</span>
          </h2>
          <p className="text-purple-800 font-bold text-xs sm:text-sm">
            Διάλεξε αυτοκόλλητο και πάτησε μέσα στο σκηνικό για να το κολλήσεις!
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-2xl text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Καθαρισμός</span>
          </button>
        </div>
      </div>

      {/* Scene Selectors */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SCENES.map((scene, idx) => (
          <button
            key={scene.id}
            onClick={() => {
              playPop();
              setSelectedSceneIndex(idx);
              setPlacedStickers([]);
            }}
            className={`px-4 py-2 rounded-2xl font-black text-sm transition-all ${
              selectedSceneIndex === idx
                ? 'bg-purple-600 text-white shadow-md scale-105'
                : 'bg-white hover:bg-purple-50 text-slate-700 border-2 border-slate-200'
            }`}
          >
            {scene.name}
          </button>
        ))}
      </div>

      {/* Sticker Tray */}
      <div className="bg-white/95 rounded-2xl p-3 border-2 border-purple-100 shadow-sm mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-black text-purple-900 mr-2 uppercase tracking-wider">
          Διάλεξε αυτοκόλλητο:
        </span>
        {currentScene.availableStickers.map((stk) => (
          <button
            key={stk}
            onClick={() => {
              playPop();
              setActiveSticker(stk);
            }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl transition-transform active:scale-90 border-2 ${
              activeSticker === stk
                ? 'scale-125 bg-yellow-200 border-amber-500 shadow-md animate-bounce'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            {stk}
          </button>
        ))}
      </div>

      {/* Interactive Sticker Scene Canvas */}
      <div
        onPointerDown={handleSceneClick}
        className={`relative w-full h-[400px] sm:h-[480px] rounded-3xl bg-gradient-to-b ${currentScene.bg} border-4 border-purple-300 shadow-xl overflow-hidden cursor-crosshair select-none touch-none`}
      >
        {placedStickers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-white/80 font-bold text-center px-4 pointer-events-none">
            {activeSticker
              ? `👇 Πάτησε οπουδήποτε για να κολλήσεις το ${activeSticker}!`
              : '👈 Διάλεξε πρώτα ένα αυτοκόλλητο από πάνω!'}
          </div>
        )}

        {/* Render Placed Stickers */}
        {placedStickers.map((item) => (
          <div
            key={item.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-6xl animate-pop pointer-events-none drop-shadow-lg"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}
