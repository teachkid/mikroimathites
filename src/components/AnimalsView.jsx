import React, { useState, useRef, useEffect } from 'react';
import { ANIMALS_DATA } from '../data/animals';
import { playPop, playFanfare } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Volume2, HelpCircle, CheckCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function AnimalsView({ onAddStar, soundEnabled }) {
  const [quizMode, setQuizMode] = useState(false);
  const [quizTarget, setQuizTarget] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [activeAnimalId, setActiveAnimalId] = useState(null);
  const activeAudioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
    };
  }, []);

  const playAnimalSound = (audioSrc) => {
    if (!soundEnabled) return;
    try {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
      }
      const audio = new Audio(audioSrc);
      activeAudioRef.current = audio;
      audio.play().catch((err) => {
        console.warn('Animal audio playback prevented:', err);
      });
    } catch (e) {
      console.error('Audio play error:', e);
    }
  };

  const handleAnimalClick = (animal) => {
    playPop();
    setActiveAnimalId(animal.id);
    setTimeout(() => setActiveAnimalId(null), 1200);

    // Play the real animal sound!
    playAnimalSound(animal.audioSrc);

    if (quizMode && quizTarget) {
      if (animal.id === quizTarget.id) {
        // Correct guess!
        playFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setFeedback({ type: 'success', msg: `🎉 Μπράβο! Είναι ο ${animal.name}!` });
        onAddStar();
        setTimeout(() => {
          nextQuiz();
        }, 2200);
      } else {
        // Wrong guess
        setFeedback({ type: 'retry', msg: `❌ Όχι, αυτό είναι ${animal.name}! Άκου ξανά τον ήχο και δοκίμασε!` });
      }
    }
  };

  const startQuiz = () => {
    playPop();
    setQuizMode(true);
    nextQuiz();
  };

  const nextQuiz = () => {
    setFeedback(null);
    const randomIndex = Math.floor(Math.random() * ANIMALS_DATA.length);
    const target = ANIMALS_DATA[randomIndex];
    setQuizTarget(target);
    // Play the authentic animal sound right away so child hears it!
    setTimeout(() => {
      playAnimalSound(target.audioSrc);
    }, 400);
  };

  const exitQuiz = () => {
    playPop();
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
    }
    setQuizMode(false);
    setQuizTarget(null);
    setFeedback(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-pop">
      {/* Quiz Banner / Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-3xl p-4 sm:p-6 border-4 border-emerald-200 shadow-md mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 flex items-center gap-2">
            <span>{quizMode ? '🎯 Βρες το Ζωάκι από τον Ήχο!' : '🐾 Ζωάκια και Πραγματικοί Ήχοι'}</span>
          </h2>
          <p className="text-emerald-800 font-bold text-sm sm:text-base mt-1">
            {quizMode
              ? 'Άκουσε τον πραγματικό ήχο και πάτησε το σωστό ζωάκι!'
              : 'Πάτησε σε όποιο ζωάκι θες για να ακούσεις τον αληθινό του ήχο!'}
          </p>
        </div>

        {quizMode ? (
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (quizTarget) {
                  playAnimalSound(quizTarget.audioSrc);
                }
              }}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-5 py-2.5 rounded-2xl shadow-sm transition-transform active:scale-95"
            >
              <Volume2 className="w-5 h-5 stroke-[2.5]" />
              <span>Άκουσε ξανά 🔊</span>
            </button>
            <button
              onClick={exitQuiz}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2.5 rounded-2xl"
            >
              Έξοδος
            </button>
          </div>
        ) : (
          <button
            onClick={startQuiz}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl kid-shadow-sm kid-shadow-active text-lg"
          >
            <HelpCircle className="w-6 h-6 stroke-[2.5]" />
            <span>Παίξε Κουίζ Ήχων!</span>
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={`text-center font-black text-xl p-3.5 rounded-2xl mb-6 shadow-sm animate-pop ${
            feedback.type === 'success'
              ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400'
              : 'bg-rose-100 text-rose-800 border-2 border-rose-400'
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Animal Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {ANIMALS_DATA.map((animal) => {
          const isPlayingThis = activeAnimalId === animal.id;
          return (
            <button
              key={animal.id}
              onClick={() => handleAnimalClick(animal)}
              className={`group p-6 rounded-3xl bg-white border-4 transition-all transform hover:-translate-y-2 active:scale-95 flex flex-col items-center cursor-pointer ${
                isPlayingThis
                  ? 'border-emerald-500 bg-emerald-50/70 scale-105 shadow-xl'
                  : 'border-emerald-100 hover:border-emerald-300 shadow-md hover:shadow-xl'
              }`}
            >
              <span className={`text-7xl sm:text-8xl mb-3 transition-transform duration-200 ${
                isPlayingThis ? 'scale-125 animate-bounce' : 'group-hover:scale-110'
              }`}>
                {animal.emoji}
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-800 mb-1">
                {animal.name}
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" />
                <span>{animal.soundText}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
