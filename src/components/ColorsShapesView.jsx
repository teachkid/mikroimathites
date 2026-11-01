import React, { useState } from 'react';
import { COLORS_DATA, SHAPES_DATA } from '../data/colorsAndShapes';
import { speakText, playPop } from '../utils/sound';
import { Volume2 } from 'lucide-react';

export default function ColorsShapesView({ onAddStar, soundEnabled }) {
  const [tab, setTab] = useState('colors'); // 'colors' or 'shapes'
  const [selectedColor, setSelectedColor] = useState(COLORS_DATA[0]);
  const [selectedShape, setSelectedShape] = useState(SHAPES_DATA[0]);

  const handleColorClick = (col) => {
    playPop();
    setSelectedColor(col);
    if (soundEnabled) {
      speakText(col.name);
    }
    onAddStar();
  };

  const handleShapeClick = (shape) => {
    playPop();
    setSelectedShape(shape);
    if (soundEnabled) {
      speakText(shape.name);
    }
    onAddStar();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-pop">
      {/* Tab Switcher */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => {
            playPop();
            setTab('colors');
          }}
          className={`px-6 py-3 rounded-2xl font-black text-lg transition-all ${
            tab === 'colors'
              ? 'bg-amber-400 text-amber-950 shadow-lg scale-105 border-3 border-amber-500'
              : 'bg-white text-slate-700 hover:bg-slate-100 border-2 border-slate-200'
          }`}
        >
          🎨 Χρώματα
        </button>

        <button
          onClick={() => {
            playPop();
            setTab('shapes');
          }}
          className={`px-6 py-3 rounded-2xl font-black text-lg transition-all ${
            tab === 'shapes'
              ? 'bg-amber-400 text-amber-950 shadow-lg scale-105 border-3 border-amber-500'
              : 'bg-white text-slate-700 hover:bg-slate-100 border-2 border-slate-200'
          }`}
        >
          🔷 Σχήματα
        </button>
      </div>

      {tab === 'colors' ? (
        <div>
          {/* Active Color Spotlight Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-200 shadow-xl flex flex-col items-center text-center mb-8">
            <div
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full shadow-inner border-4 border-white shadow-lg transition-all transform hover:scale-110 mb-4 cursor-pointer"
              style={{ backgroundColor: selectedColor.hex }}
              onClick={() => handleColorClick(selectedColor)}
            />

            <h3 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">
              {selectedColor.name}
            </h3>

            <button
              onClick={() => handleColorClick(selectedColor)}
              className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-5 py-2.5 rounded-full transition-transform active:scale-95"
            >
              <Volume2 className="w-5 h-5" />
              <span>Άκουσε το χρώμα</span>
            </button>
          </div>

          {/* Palette Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {COLORS_DATA.map((col) => (
              <button
                key={col.name}
                onClick={() => handleColorClick(col)}
                className={`p-4 rounded-3xl bg-white border-4 transition-all flex flex-col items-center gap-2 shadow hover:-translate-y-1 ${
                  selectedColor.name === col.name ? 'border-amber-400 scale-105' : 'border-slate-100'
                }`}
              >
                <div
                  className="w-16 h-16 rounded-2xl shadow-sm border-2 border-slate-100"
                  style={{ backgroundColor: col.hex }}
                />
                <span className="font-black text-slate-800 text-lg">{col.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Active Shape Spotlight */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-200 shadow-xl flex flex-col items-center text-center mb-8">
            <div
              className="text-8xl sm:text-9xl mb-3 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => handleShapeClick(selectedShape)}
            >
              {selectedShape.icon}
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">
              {selectedShape.name}
            </h3>
            <button
              onClick={() => handleShapeClick(selectedShape)}
              className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-5 py-2.5 rounded-full transition-transform active:scale-95"
            >
              <Volume2 className="w-5 h-5" />
              <span>Άκουσε το σχήμα</span>
            </button>
          </div>

          {/* Shapes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {SHAPES_DATA.map((shape) => (
              <button
                key={shape.id}
                onClick={() => handleShapeClick(shape)}
                className={`p-5 rounded-3xl bg-white border-4 transition-all flex flex-col items-center gap-2 shadow hover:-translate-y-1 ${
                  selectedShape.id === shape.id ? 'border-amber-400 scale-105' : 'border-slate-100'
                }`}
              >
                <span className="text-6xl">{shape.icon}</span>
                <span className="font-black text-slate-800 text-xl">{shape.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
