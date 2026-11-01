import React, { useRef, useState, useEffect } from 'react';
import { playPop, playFanfare, speakText } from '../utils/sound';
import confetti from 'canvas-confetti';
import { RotateCcw, Download, Award } from 'lucide-react';

const COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#FACC15', // Yellow
  '#22C55E', // Green
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#A855F7', // Purple
  '#EC4899', // Pink
  '#1E293B', // Slate
  '#FFFFFF', // Eraser
];

export default function DrawingPadView({ onAddStar, soundEnabled }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [selectedColor, setSelectedColor] = useState('#EF4444');
  const [brushSize, setBrushSize] = useState(14);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

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
    } catch (err) {}

    isDrawing.current = true;
    const { x, y } = getCoordinates(e);

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selectedColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
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

  const handleClear = () => {
    playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveDrawing = () => {
    playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'i-zografia-mou.png';
    link.href = image;
    link.click();
  };

  const handleFinishDrawing = () => {
    playFanfare();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    onAddStar();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 animate-pop">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-3xl p-4 sm:p-6 border-4 border-pink-200 shadow-md mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-pink-950">
            ✍️ Μαγικός Πίνακας Ζωγραφικής
          </h2>
          <p className="text-pink-800 font-bold text-xs sm:text-sm">
            Ζωγράφισε ό,τι φαντάζεσαι με τα μαγικά χρώματα!
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-2xl active:scale-95"
            title="Καθαρισμός"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="hidden sm:inline">Καθαρισμός</span>
          </button>

          <button
            onClick={handleSaveDrawing}
            className="flex items-center gap-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold px-3 py-2 rounded-2xl active:scale-95"
            title="Αποθήκευση εικόνας"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Αποθήκευση</span>
          </button>

          <button
            onClick={handleFinishDrawing}
            className="flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white font-black px-4 py-2 rounded-2xl kid-shadow-sm active:scale-95"
          >
            <Award className="w-5 h-5" />
            <span>Έτοιμο! ⭐</span>
          </button>
        </div>
      </div>

      {/* Palette and Brush selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur rounded-2xl p-3 border-2 border-pink-100 mb-4 shadow-sm">
        {/* Colors */}
        <div className="flex flex-wrap gap-2 items-center">
          {COLORS.map((col) => (
            <button
              key={col}
              onClick={() => {
                playPop();
                setSelectedColor(col);
              }}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-4 transition-transform active:scale-90 ${
                selectedColor === col ? 'scale-125 border-slate-900 shadow-md' : 'border-slate-200'
              }`}
              style={{ backgroundColor: col }}
              title={col === '#FFFFFF' ? 'Γόμα (Σβήστρα)' : 'Χρώμα'}
            >
              {col === '#FFFFFF' && <span className="text-xs font-bold text-slate-500">🧽</span>}
            </button>
          ))}
        </div>

        {/* Brush Sizes */}
        <div className="flex items-center gap-2">
          {[8, 16, 26].map((size) => (
            <button
              key={size}
              onClick={() => {
                playPop();
                setBrushSize(size);
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border-2 active:scale-95 ${
                brushSize === size
                  ? 'bg-pink-100 border-pink-500 text-pink-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div
                className="bg-slate-700 rounded-full"
                style={{ width: `${size / 2}px`, height: `${size / 2}px` }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="bg-white rounded-3xl border-4 border-pink-300 shadow-xl overflow-hidden touch-none flex justify-center items-center select-none">
        <canvas
          ref={canvasRef}
          width={800}
          height={550}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full max-w-full h-auto cursor-crosshair aspect-[4/3] bg-white touch-none"
          style={{ touchAction: 'none' }}
        />
      </div>
    </div>
  );
}
