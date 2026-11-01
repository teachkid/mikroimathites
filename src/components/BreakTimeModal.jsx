import React, { useState } from 'react';
import { useScreenTime } from '../context/ScreenTimeContext';
import { playPop, playFanfare } from '../utils/sound';
import { Moon, ShieldCheck, Plus, Check } from 'lucide-react';

export default function BreakTimeModal() {
  const { isTimeUp, extendTime, setLimitMinutes } = useScreenTime();
  const [showParentUnlock, setShowParentUnlock] = useState(false);
  const [num1] = useState(() => Math.floor(Math.random() * 6) + 3);
  const [num2] = useState(() => Math.floor(Math.random() * 5) + 2);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  if (!isTimeUp) return null;

  const handleParentUnlock = (e) => {
    e.preventDefault();
    if (parseInt(answer, 10) === num1 * num2) {
      playFanfare();
      extendTime(15);
      setShowParentUnlock(false);
      setAnswer('');
      setError(false);
    } else {
      setError(true);
      setAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-pop">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl text-center">
        {/* Animated Moon / Sleep Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 border-4 border-indigo-300 text-4xl mb-4 animate-bounce">
          🌙
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
          Ώρα για Διάλειμμα! 😴
        </h2>

        <p className="text-sm font-bold text-slate-600 mb-6 leading-relaxed">
          Τα ματάκια μας κουράστηκαν! Πάμε να πιούμε λίγο νερό, να τεντωθούμε ή να παίξουμε έξω με τα παιχνίδια μας! 🎈
        </p>

        {!showParentUnlock ? (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-xs font-bold text-amber-900">
              💡 Το όριο χρόνου οθόνης ορίστηκε από τον γονέα σας για ξεκούραση.
            </div>

            <button
              onClick={() => {
                playPop();
                setShowParentUnlock(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 py-2 cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Είμαι ο Γονέας (Ξεκλείδωμα / Παράταση)</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleParentUnlock} className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-3">
            <h4 className="text-xs font-black text-slate-800">
              🔒 Ζώνη Γονέα: Λύστε την πράξη για παράταση 15 λεπτών
            </h4>

            <div className="text-xl font-black text-indigo-950 bg-white py-2 rounded-xl border border-indigo-200">
              {num1} × {num2} = ?
            </div>

            <input
              type="number"
              required
              autoFocus
              placeholder="Αποτέλεσμα"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full text-center py-2 px-3 rounded-xl border-2 border-slate-300 font-black text-lg focus:outline-hidden focus:border-amber-400"
            />

            {error && (
              <p className="text-xs font-black text-rose-500">
                Λάθος αποτέλεσμα, δοκιμάστε ξανά!
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowParentUnlock(false)}
                className="flex-1 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Ακύρωση
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs kid-shadow-sm active:scale-95"
              >
                +15 Λεπτά ✨
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
