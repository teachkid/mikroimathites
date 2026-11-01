import React, { useState, useEffect, useMemo } from 'react';
import { playPop, playFanfare, playChime, speakText, speakCheer } from '../utils/sound';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { Volume2, Award, RotateCcw, Lightbulb, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const WORDS_DATABASE = [
  { word: 'ΓΑΤΑ', emoji: '🐱', hint: 'Νιαουρίζει και της αρέσει το γάλα!' },
  { word: 'ΣΚΥΛΟΣ', emoji: '🐶', hint: 'Ο πιο πιστός φίλος του ανθρώπου!' },
  { word: 'ΗΛΙΟΣ', emoji: '☀️', hint: 'Μας ζεσταίνει ψηλά στον ουρανό!' },
  { word: 'ΜΗΛΟ', emoji: '🍎', hint: 'Νόστιμο, τραγανό κόκκινο φρούτο!' },
  { word: 'ΨΑΡΙ', emoji: '🐟', hint: 'Κολυμπάει στη θάλασσα και στα ποτάμια!' },
  { word: 'ΠΑΠΙΑ', emoji: '🦆', hint: 'Κάνει πα-πα-πα στη λίμνη!' },
  { word: 'ΣΠΙΤΙ', emoji: '🏠', hint: 'Εκεί που μένει η οικογένειά μας!' },
  { word: 'ΑΡΚΟΥΔΑ', emoji: '🐻', hint: 'Της αρέσει το μέλι και κοιμάται το χειμώνα!' },
  { word: 'ΛΙΟΝΤΑΡΙ', emoji: '🦁', hint: 'Ο βασιλιάς των ζώων!' },
  { word: 'ΜΠΑΝΑΝΑ', emoji: '🍌', hint: 'Κίτρινο γλυκό φρούτο που αγαπούν οι μαϊμούδες!' },
  { word: 'ΠΑΓΩΤΟ', emoji: '🍦', hint: 'Δροσερό και γλυκό το καλοκαίρι!' },
  { word: 'ΚΑΡΑΒΙ', emoji: '⛵', hint: 'Ταξιδεύει στα κύματα της θάλασσας!' },
  { word: 'ΒΑΤΡΑΧΟΣ', emoji: '🐸', hint: 'Κάνει κουάξ-κουάξ και πηδάει ψηλά!' },
  { word: 'ΑΣΤΕΡΙ', emoji: '⭐', hint: 'Λάμπει φωτεινό τη νύχτα στον ουρανό!' },
];

export default function SpellingGameView({ onAddStar, soundEnabled }) {
  const { recordStat } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [availableTiles, setAvailableTiles] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentItem = WORDS_DATABASE[currentIndex];
  const targetWord = currentItem.word;

  // Initialize or reset current word
  useEffect(() => {
    setIsSuccess(false);
    setShowHint(false);
    setPlacedLetters(Array(targetWord.length).fill(null));

    // Scramble target letters with a unique id
    const letters = targetWord.split('').map((char, index) => ({
      id: `${char}-${index}-${Math.random()}`,
      char,
    }));

    // Shuffle letters
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setAvailableTiles(shuffled);

    // Speak initial prompt
    if (soundEnabled) {
      setTimeout(() => {
        speakText(`Φτιάξε τη λέξη ${currentItem.word.toLowerCase()}`);
      }, 300);
    }
  }, [currentIndex, targetWord, currentItem.word, soundEnabled]);

  const handleHearWord = () => {
    playPop();
    speakText(currentItem.word.toLowerCase());
  };

  const handleTileClick = (tile) => {
    if (isSuccess) return;
    playPop();

    // Pronounce letter
    if (soundEnabled) {
      speakText(tile.char);
    }

    // Find first empty slot
    const emptyIndex = placedLetters.findIndex((slot) => slot === null);
    if (emptyIndex === -1) return;

    const nextPlaced = [...placedLetters];
    nextPlaced[emptyIndex] = tile;
    setPlacedLetters(nextPlaced);

    // Remove from available tiles
    setAvailableTiles((prev) => prev.filter((t) => t.id !== tile.id));

    // Check if word is now completed
    const isNowFull = nextPlaced.every((slot) => slot !== null);
    if (isNowFull) {
      const spelled = nextPlaced.map((slot) => slot.char).join('');
      if (spelled === targetWord) {
        // SUCCESS!
        setIsSuccess(true);
        playFanfare();
        speakCheer();
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          speakText(`Μπράβο! ${targetWord.toLowerCase()}`);
        }, 1200);

        onAddStar();
        recordStat('spelling', 1);
      } else {
        // Not matching
        setTimeout(() => {
          playPop();
        }, 300);
      }
    }
  };

  const handleSlotClick = (index) => {
    if (isSuccess) return;
    const tile = placedLetters[index];
    if (!tile) return;

    playPop();
    // Remove from slot
    const nextPlaced = [...placedLetters];
    nextPlaced[index] = null;
    setPlacedLetters(nextPlaced);

    // Return to available tiles
    setAvailableTiles((prev) => [...prev, tile]);
  };

  const handleReset = () => {
    playPop();
    setIsSuccess(false);
    setPlacedLetters(Array(targetWord.length).fill(null));

    const letters = targetWord.split('').map((char, index) => ({
      id: `${char}-${index}-${Math.random()}`,
      char,
    }));
    setAvailableTiles([...letters].sort(() => Math.random() - 0.5));
  };

  const handleHint = () => {
    playPop();
    setShowHint(true);
    // Find first missing or wrong slot
    for (let i = 0; i < targetWord.length; i++) {
      if (!placedLetters[i] || placedLetters[i].char !== targetWord[i]) {
        // Find matching tile in available tiles
        const correctTile = availableTiles.find((t) => t.char === targetWord[i]);
        if (correctTile) {
          handleTileClick(correctTile);
        }
        break;
      }
    }
  };

  const handleNextWord = () => {
    playPop();
    setCurrentIndex((prev) => (prev + 1) % WORDS_DATABASE.length);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 animate-pop">
      {/* Top Banner */}
      <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border-2 border-amber-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔤</span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-amber-950">
              Φτιάξε τη Λέξη!
            </h2>
            <span className="text-xs text-amber-800 font-bold">
              Λέξη {currentIndex + 1} από {WORDS_DATABASE.length}
            </span>
          </div>
        </div>

        <button
          onClick={handleNextWord}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs kid-shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <span>Επόμενη</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Flashcard Display */}
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl text-center relative overflow-hidden mb-6">
        {/* Giant Emoji Illustration */}
        <div className="relative inline-block mb-3">
          <div className="text-7xl sm:text-8xl drop-shadow-md select-none animate-pop">
            {currentItem.emoji}
          </div>
          <button
            onClick={handleHearWord}
            className="absolute -bottom-2 -right-2 p-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-md active:scale-95 transition-all cursor-pointer border-2 border-white"
            title="Άκουσε τη λέξη"
          >
            <Volume2 className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Word Clue */}
        <p className="text-xs sm:text-sm text-amber-900/80 font-bold mb-6">
          {showHint ? currentItem.hint : 'Πάτησε τα γράμματα στη σωστή σειρά!'}
        </p>

        {/* Target Letter Slots */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
          {placedLetters.map((slot, idx) => (
            <button
              key={`slot-${idx}`}
              onClick={() => handleSlotClick(idx)}
              className={`w-12 h-14 sm:w-16 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-4xl transition-all cursor-pointer border-3 ${
                slot
                  ? isSuccess
                    ? 'bg-emerald-400 text-white border-emerald-500 shadow-lg scale-105 animate-bounce'
                    : 'bg-white text-slate-800 border-amber-400 shadow-md active:scale-95'
                  : 'bg-amber-200/50 border-dashed border-amber-400 text-amber-300'
              }`}
              title={slot ? 'Πάτησε για αφαίρεση' : 'Κενή θέση'}
            >
              {slot ? slot.char : '_'}
            </button>
          ))}
        </div>

        {/* Success Banner */}
        {isSuccess && (
          <div className="mb-4 inline-flex items-center gap-2 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-black px-4 py-2 rounded-2xl animate-pop text-sm sm:text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Μπράβο! Κέρδισες 1 Αστέρι! ⭐</span>
          </div>
        )}

        {/* Scrambled Letter Tiles */}
        <div className="pt-4 border-t-2 border-amber-200/70">
          <p className="text-xs font-black text-amber-900 mb-3 uppercase tracking-wider">
            {availableTiles.length > 0 ? 'Διαθέσιμα Γράμματα:' : 'Όλα τα γράμματα τοποθετήθηκαν!'}
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 min-h-[56px]">
            {availableTiles.map((tile) => (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-gradient-to-b from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-black text-2xl sm:text-3xl border-b-4 border-blue-700 shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              >
                {tile.char}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer border border-slate-300"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Καθαρισμός</span>
        </button>

        <button
          onClick={handleHint}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-yellow-100 hover:bg-yellow-200 text-amber-900 font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer border border-yellow-300"
        >
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Βοήθεια</span>
        </button>

        <button
          onClick={handleNextWord}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs sm:text-sm active:scale-95 transition-all cursor-pointer kid-shadow-sm"
        >
          <span>Επόμενη Λέξη</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
