import React from 'react';
import { playPop } from '../utils/sound';

export default function HomeMenu({ onSelectCategory }) {
  const categories = [
    {
      id: 'alphabet',
      title: 'Αλφαβήτα',
      subtitle: 'Α – Ω, γράμματα & σχεδίαση',
      emoji: '🔤',
      color: 'from-rose-400 to-red-500',
      border: 'border-red-300',
      bgGlow: 'hover:shadow-rose-300/60',
      badge: '24 Γράμματα',
    },
    {
      id: 'numbers',
      title: 'Αριθμοί',
      subtitle: '1 – 25, μέτρησε διασκεδαστικά',
      emoji: '🔢',
      color: 'from-amber-400 to-yellow-500',
      border: 'border-amber-300',
      bgGlow: 'hover:shadow-amber-300/60',
      badge: '1 έως 25',
    },
    {
      id: 'math',
      title: 'Διασκεδαστικά Μαθηματικά',
      subtitle: 'Πρόσθεση, Αφαίρεση, Πολλαπλασιασμός & Διαίρεση!',
      emoji: '➕',
      color: 'from-teal-500 to-emerald-600',
      border: 'border-teal-300',
      bgGlow: 'hover:shadow-teal-300/60',
      badge: 'ΝΕΟ • 4 Πράξεις',
    },
    {
      id: 'piano',
      title: 'Παιδικό Πιάνο',
      subtitle: 'Παίξε νότες & μάθε γνωστά τραγουδάκια!',
      emoji: '🎹',
      color: 'from-fuchsia-500 to-pink-600',
      border: 'border-fuchsia-300',
      bgGlow: 'hover:shadow-fuchsia-300/60',
      badge: 'Μουσική',
    },
    {
      id: 'balloons',
      title: 'Σπάσε τα Μπαλόνια',
      subtitle: 'Πέτα ψηλά και σκάσε πολύχρωμα μπαλόνια!',
      emoji: '🎈',
      color: 'from-sky-400 to-cyan-500',
      border: 'border-sky-300',
      bgGlow: 'hover:shadow-sky-300/60',
      badge: 'Παιχνίδι',
    },
    {
      id: 'shadows',
      title: 'Ταίριαξε τις Σκιές',
      subtitle: 'Βρες ποιο ζωάκι ταιριάζει στη σκιά!',
      emoji: '🧩',
      color: 'from-emerald-400 to-teal-600',
      border: 'border-emerald-300',
      bgGlow: 'hover:shadow-emerald-300/60',
      badge: 'Παζλ',
    },
    {
      id: 'colors-shapes',
      title: 'Χρώματα & Σχήματα',
      subtitle: 'Κύκλος, αστέρι & ζωηρά χρώματα',
      emoji: '🎨',
      color: 'from-blue-400 to-indigo-500',
      border: 'border-blue-300',
      bgGlow: 'hover:shadow-blue-300/60',
      badge: 'Χρώματα',
    },
    {
      id: 'animals',
      title: 'Ζωάκια & Ήχοι',
      subtitle: 'Πώς κάνουν τα αγαπημένα σου ζώα;',
      emoji: '🦁',
      color: 'from-lime-500 to-green-600',
      border: 'border-lime-300',
      bgGlow: 'hover:shadow-lime-300/60',
      badge: 'Ήχοι Ζώων',
    },
    {
      id: 'memory',
      title: 'Παιχνίδι Μνήμης',
      subtitle: 'Βρες τις ίδιες κάρτες και κέρδισε αστέρια!',
      emoji: '🧠',
      color: 'from-purple-500 to-violet-600',
      border: 'border-purple-300',
      bgGlow: 'hover:shadow-purple-300/60',
      badge: 'Mini Game',
    },
    {
      id: 'stickers',
      title: 'Άλμπουμ Αυτοκόλλητων',
      subtitle: 'Κόλλησε αυτοκόλλητα στη θάλασσα & στη φάρμα!',
      emoji: '📖',
      color: 'from-violet-500 to-purple-700',
      border: 'border-violet-300',
      bgGlow: 'hover:shadow-violet-300/60',
      badge: 'Αυτοκόλλητα',
    },
    {
      id: 'drawing',
      title: 'Μαγικός Πίνακας',
      subtitle: 'Ζωγράφισε ελεύθερα με πολλά χρώματα!',
      emoji: '✍️',
      color: 'from-pink-400 to-rose-500',
      border: 'border-pink-300',
      bgGlow: 'hover:shadow-pink-300/60',
      badge: 'Ζωγραφική',
    },
    {
      id: 'scoreboard',
      title: 'Πίνακας Πρωταθλητών',
      subtitle: 'Δες τα αστέρια σου, το βάθρο & τα παράσημα!',
      emoji: '🏆',
      color: 'from-yellow-400 to-amber-500',
      border: 'border-amber-300',
      bgGlow: 'hover:shadow-amber-300/60',
      badge: 'TOP • Ρεκόρ',
    },
    {
      id: 'shop',
      title: 'Μαγικό Κατάστημα',
      subtitle: 'Αγόρασε σούπερ avatars & δώρα με τα αστέρια σου!',
      emoji: '🛍️',
      color: 'from-pink-500 to-rose-600',
      border: 'border-pink-300',
      bgGlow: 'hover:shadow-pink-300/60',
      badge: 'Δώρα',
    },
  ];

  const handleCardClick = (cat) => {
    playPop();
    onSelectCategory(cat.id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 animate-pop">
      {/* Welcome Banner */}
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="text-3xl sm:text-5xl font-black text-amber-950 mb-2 drop-shadow-sm">
          Τι θέλεις να μάθουμε σήμερα; 🌟
        </h2>
        <p className="text-base sm:text-xl font-bold text-amber-800">
          Διάλεξε ένα παιχνίδι και ξεκινάμε!
        </p>
      </div>

      {/* Grid of Activities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCardClick(cat)}
            className={`group relative flex flex-col items-center text-center p-6 rounded-3xl bg-gradient-to-b ${cat.color} text-white border-4 ${cat.border} shadow-lg ${cat.bgGlow} kid-shadow-active transition-all transform hover:-translate-y-2 cursor-pointer active:scale-95`}
          >
            {/* Top Badge */}
            <span className="absolute top-3.5 right-3.5 bg-white/25 backdrop-blur-sm text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
              {cat.badge}
            </span>

            {/* Giant Animated Emoji */}
            <div className="text-6xl sm:text-7xl mb-3 group-hover:scale-125 transition-transform duration-300 filter drop-shadow-md">
              {cat.emoji}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black tracking-tight mb-1 drop-shadow">
              {cat.title}
            </h3>

            {/* Subtitle */}
            <p className="text-white/90 font-bold text-xs sm:text-sm leading-snug">
              {cat.subtitle}
            </p>

            {/* Tap prompt */}
            <div className="mt-4 bg-white text-slate-800 font-black px-4 py-1.5 rounded-full text-xs sm:text-sm kid-shadow-sm group-hover:bg-yellow-200 transition-colors">
              Παίξε τώρα! ✨
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
