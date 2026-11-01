import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ALPHABET_DATA } from '../data/alphabet';
import { speakText, playPop, playFanfare, speakCheer } from '../utils/sound';
import { useAuth } from '../context/AuthContext';
import { validateLetterDrawing } from '../utils/letterValidator';
import confetti from 'canvas-confetti';
import { Volume2, ArrowLeft, ArrowRight, RotateCcw, Award, Edit3, Eye, AlertCircle, CheckCircle } from 'lucide-react';

const SPOKEN_LETTER_PREFIX = {
  'Ε': 'Έψιλον',
  'Η': 'Ήτα',
  'Ο': 'Όμικρον',
  'Υ': 'Ύψιλον',
  'Ω': 'Ωμέγα',
};

export default function AlphabetView({ onAddStar, soundEnabled }) {
  const { recordStat } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState('card'); // 'card' or 'trace'
  const [brushColor, setBrushColor] = useState('#EF4444');
  const [traceFeedback, setTraceFeedback] = useState(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  const current = ALPHABET_DATA[selectedIndex];

  // Pronounce letter association (e.g. "Α όπως αρκούδα", "Έψιλον όπως ελέφαντας", "Ήτα όπως ήλιος", "Όμικρον όπως ομπρέλα", "Ωμέγα όπως ωκεανός")
  const speakCurrent = useCallback(() => {
    if (soundEnabled) {
      const prefix = SPOKEN_LETTER_PREFIX[current.letterUpper] || current.letterUpper;
      speakText(`${prefix} όπως ${current.word.toLowerCase()}`);
    }
  }, [current, soundEnabled]);

  const clearCanvas = useCallback(() => {
    setTraceFeedback(null);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    setTraceFeedback(null);
    if (mode === 'trace') {
      clearCanvas();
    }
  }, [selectedIndex, mode, clearCanvas]);

  // Navigate letters
  const handlePrev = () => {
    playPop();
    setTraceFeedback(null);
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : ALPHABET_DATA.length - 1));
  };

  const handleNext = () => {
    playPop();
    setTraceFeedback(null);
    setSelectedIndex((prev) => (prev < ALPHABET_DATA.length - 1 ? prev + 1 : 0));
  };

  // Modern Unified Pointer Event Handlers (Works on Mouse, Touch, Apple Pencil, Stylus)
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (err) {
      // Ignore if pointer capture isn't supported
    }

    isDrawing.current = true;
    const { x, y } = getCoordinates(e);

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 24;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y); // draw initial dot
    ctx.stroke();
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCoordinates(e);
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (e) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch (err) {}

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
  };

  const handleCompleteTrace = () => {
    playPop();
    const result = validateLetterDrawing(canvasRef.current, current.letterUpper);
    setTraceFeedback(result);

    if (result.success) {
      playFanfare();
      speakCheer();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      recordStat('trace', 1);
      onAddStar();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 animate-pop">
      {/* Alphabet quick-scroll row */}
      <div className="flex gap-2 overflow-x-auto pb-3 pt-1 px-1 no-scrollbar touch-pan-x">
        {ALPHABET_DATA.map((item, idx) => (
          <button
            key={item.letterUpper}
            onClick={() => {
              playPop();
              setSelectedIndex(idx);
            }}
            className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center transition-all ${
              idx === selectedIndex
                ? 'bg-amber-400 text-amber-950 scale-110 shadow-lg border-3 border-amber-500 font-extrabold'
                : 'bg-white text-slate-700 hover:bg-amber-100 border-2 border-slate-200'
            }`}
          >
            {item.letterUpper}
          </button>
        ))}
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center gap-3 my-3 sm:my-4">
        <button
          onClick={() => {
            playPop();
            setMode('card');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base transition-all ${
            mode === 'card'
              ? 'bg-rose-500 text-white shadow-md scale-105'
              : 'bg-white text-slate-700 hover:bg-slate-100 border-2 border-slate-200'
          }`}
        >
          <Eye className="w-5 h-5" />
          <span>Κάρτα & Ήχος</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setMode('trace');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base transition-all ${
            mode === 'trace'
              ? 'bg-rose-500 text-white shadow-md scale-105'
              : 'bg-white text-slate-700 hover:bg-slate-100 border-2 border-slate-200'
          }`}
        >
          <Edit3 className="w-5 h-5" />
          <span>Σχεδίασε το Γράμμα</span>
        </button>
      </div>

      {/* Main Content Area */}
      {mode === 'card' ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-amber-200 shadow-xl flex flex-col items-center text-center">
          {/* Letters Display */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 my-2 sm:my-4">
            <span className="text-8xl sm:text-9xl font-black text-slate-900 tracking-tight drop-shadow-sm font-bubble">
              {current.letterUpper}
            </span>
            <span className="text-6xl sm:text-7xl font-bold text-rose-500 font-bubble">
              {current.letterLower}
            </span>
          </div>

          {/* Letter Name */}
          <div className="inline-block bg-amber-100 text-amber-900 font-black text-2xl sm:text-3xl px-6 py-2 rounded-full mb-6">
            « {current.name} »
          </div>

          {/* Word & Emoji Association */}
          <button
            onClick={() => {
              playPop();
              speakCurrent();
            }}
            className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50 border-3 border-amber-300 p-4 sm:p-6 rounded-3xl hover:scale-105 transition-transform cursor-pointer shadow-sm group active:scale-95"
          >
            <span className="text-5xl sm:text-7xl group-hover:scale-125 transition-transform duration-200">
              {current.emoji}
            </span>
            <div className="text-left">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                {current.letterUpper} όπως...
              </span>
              <span className="text-2xl sm:text-4xl font-black text-slate-800">
                {current.word}
              </span>
            </div>
            <Volume2 className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600 stroke-[2.5] ml-2 animate-bounce" />
          </button>
        </div>
      ) : (
        /* Tracing Mode */
        <div className="bg-white rounded-3xl p-4 sm:p-6 border-4 border-amber-200 shadow-xl flex flex-col items-center">
          <p className="text-amber-900 font-bold text-base sm:text-lg mb-2 text-center">
            Σχεδίασε πάνω από το γράμμα με το δάχτυλο! ✍️
          </p>

          {/* Color palette */}
          <div className="flex gap-2 sm:gap-3 mb-3">
            {['#EF4444', '#3B82F6', '#22C55E', '#A855F7', '#F59E0B'].map((col) => (
              <button
                key={col}
                onClick={() => setBrushColor(col)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-4 transition-transform active:scale-90 ${
                  brushColor === col ? 'scale-125 border-slate-900 shadow-md' : 'border-white'
                }`}
                style={{ backgroundColor: col }}
              />
            ))}
          </div>

          {/* Tracing Canvas Container with underlying Guide Letter */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-amber-50 border-4 border-dashed border-amber-300 rounded-3xl flex items-center justify-center overflow-hidden touch-none select-none">
            {/* Guide letter underneath */}
            <div className="absolute inset-0 flex items-center justify-center text-slate-200/90 font-black text-[170px] sm:text-[190px] leading-none select-none pointer-events-none font-bubble">
              {current.letterUpper}
            </div>

            {/* Interactive Drawing Canvas */}
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative z-10 w-full h-full cursor-crosshair touch-none"
              style={{ touchAction: 'none' }}
            />
          </div>

          {/* Feedback banner if checked */}
          {traceFeedback && (
            <div
              className={`mt-3 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 animate-pop ${
                traceFeedback.success
                  ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-900'
                  : 'bg-rose-100 border-2 border-rose-400 text-rose-900'
              }`}
            >
              {traceFeedback.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              <span>{traceFeedback.message}</span>
            </div>
          )}

          {/* Trace Action Controls */}
          <div className="flex gap-3 sm:gap-4 mt-4">
            <button
              onClick={() => {
                playPop();
                clearCanvas();
              }}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 sm:py-2.5 rounded-2xl border-2 border-slate-300"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Σβήσιμο</span>
            </button>

            <button
              onClick={handleCompleteTrace}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-5 sm:px-6 py-2 sm:py-2.5 rounded-2xl kid-shadow-sm kid-shadow-active text-base sm:text-lg"
            >
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Έλεγχος & Αστέρι! ⭐</span>
            </button>
          </div>
        </div>
      )}

      {/* Prev / Next Buttons */}
      <div className="flex justify-between items-center mt-4 sm:mt-6">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl kid-shadow-sm kid-shadow-active text-base sm:text-lg"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
          <span>Προηγούμενο</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl kid-shadow-sm kid-shadow-active text-base sm:text-lg"
        >
          <span>Επόμενο</span>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
