import React, { useState, useEffect, useRef } from 'react';
import { playPop, playChime, playFanfare, speakText } from '../utils/sound';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { RotateCcw, Award } from 'lucide-react';

const CARD_ITEMS = [
  { id: 'bear', emoji: '🐻', name: 'Αρκούδα' },
  { id: 'frog', emoji: '🐸', name: 'Βάτραχος' },
  { id: 'duck', emoji: '🦆', name: 'Παπάκι' },
  { id: 'apple', emoji: '🍎', name: 'Μήλο' },
  { id: 'star', emoji: '⭐', name: 'Αστέρι' },
  { id: 'car', emoji: '🚗', name: 'Αυτοκινητάκι' },
];

export default function MemoryGameView({ onAddStar, soundEnabled }) {
  const { recordStat } = useAuth();
  const [pairsCount, setPairsCount] = useState(3); // 3 pairs (6 cards) or 4 pairs (8 cards)
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [isWon, setIsWon] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Initialize deck
  const initGame = (numPairs = pairsCount) => {
    const selectedItems = CARD_ITEMS.slice(0, numPairs);
    const deck = [...selectedItems, ...selectedItems]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        uniqueId: `${item.id}-${index}`,
        ...item
      }));

    setCards(deck);
    setFlippedIndices([]);
    setMatchedIds(new Set());
    setIsWon(false);
  };

  useEffect(() => {
    initGame(pairsCount);
  }, [pairsCount]);

  const handleCardClick = (index) => {
    // If already flipped or matched or 2 cards already being compared, return
    if (
      flippedIndices.includes(index) ||
      matchedIds.has(cards[index].id) ||
      flippedIndices.length >= 2
    ) {
      return;
    }

    playPop();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // If 2 cards are now open, check match
    if (newFlipped.length === 2) {
      const card1 = cards[newFlipped[0]];
      const card2 = cards[newFlipped[1]];

      if (card1.id === card2.id) {
        // MATCH!
        timeoutRef.current = setTimeout(() => {
          playChime();
          const newMatched = new Set(matchedIds);
          newMatched.add(card1.id);
          setMatchedIds(newMatched);
          setFlippedIndices([]);

          // Check if won all
          if (newMatched.size === pairsCount) {
            setIsWon(true);
            playFanfare();
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.6 }
            });
            recordStat('memory', 1);
            onAddStar();
            onAddStar();
          }
        }, 600);
      } else {
        // NO MATCH
        timeoutRef.current = setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-pop">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 sm:p-6 border-4 border-purple-200 shadow-md mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
            🧠 Παιχνίδι Μνήμης
          </h2>
          <p className="text-purple-800 font-bold text-sm sm:text-base">
            Γύρισε τις κάρτες και βρες τα όμοια ζευγάρια!
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty */}
          <button
            onClick={() => {
              playPop();
              setPairsCount(2);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-sm ${
              pairsCount === 2 ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-900'
            }`}
          >
            4 Κάρτες
          </button>
          <button
            onClick={() => {
              playPop();
              setPairsCount(3);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-sm ${
              pairsCount === 3 ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-900'
            }`}
          >
            6 Κάρτες
          </button>
          <button
            onClick={() => {
              playPop();
              setPairsCount(4);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-sm ${
              pairsCount === 4 ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-900'
            }`}
          >
            8 Κάρτες
          </button>

          <button
            onClick={() => {
              playPop();
              initGame(pairsCount);
            }}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
            title="Νέο Παιχνίδι"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isWon && (
        <div className="bg-emerald-100 border-3 border-emerald-400 text-emerald-900 p-6 rounded-3xl text-center mb-6 shadow-md animate-pop">
          <h3 className="text-3xl font-black mb-2">🎉 Νίκησες! Συγχαρητήρια!</h3>
          <p className="text-lg font-bold mb-4">Κέρδισες 2 χρυσά αστέρια! ⭐⭐</p>
          <button
            onClick={() => initGame(pairsCount)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2.5 rounded-2xl kid-shadow-sm text-lg"
          >
            Παίξε Ξανά! 🔄
          </button>
        </div>
      )}

      {/* Grid of Cards */}
      <div
        className={`grid gap-4 sm:gap-6 justify-center ${
          cards.length <= 4 ? 'grid-cols-2 max-w-sm mx-auto' : 'grid-cols-3 sm:grid-cols-4'
        }`}
      >
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx) || matchedIds.has(card.id);
          const isMatched = matchedIds.has(card.id);

          return (
            <button
              key={card.uniqueId}
              onClick={() => handleCardClick(idx)}
              className={`h-32 sm:h-40 rounded-3xl font-black text-5xl sm:text-6xl flex items-center justify-center transition-all duration-300 transform ${
                isFlipped
                  ? isMatched
                    ? 'bg-emerald-100 border-4 border-emerald-400 rotate-0 scale-100 shadow'
                    : 'bg-white border-4 border-purple-400 rotate-0 shadow-lg'
                  : 'bg-gradient-to-br from-purple-500 to-indigo-600 border-4 border-purple-300 hover:scale-105 shadow-md'
              }`}
            >
              {isFlipped ? (
                <span className="animate-pop">{card.emoji}</span>
              ) : (
                <span className="text-3xl sm:text-4xl text-purple-200">❓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
