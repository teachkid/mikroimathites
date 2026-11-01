import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { playPop, playFanfare, playChime, speakText } from '../utils/sound';
import { X, ShoppingBag, Star, Check, Sparkles, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

const SHOP_ITEMS = [
  // AVATARS
  {
    id: 'avatar_hero',
    type: 'avatar',
    avatar: '🦸‍♂️',
    name: 'Σούπερ Ήρωας',
    desc: 'Φόρεσε την κάπα και σώσε τον κόσμο!',
    cost: 10,
    category: 'avatars',
  },
  {
    id: 'avatar_wizard',
    type: 'avatar',
    avatar: '🧙‍♂️',
    name: 'Μάγος με Ραβδί',
    desc: 'Κάνει μαγικά κόλπα με τα αστέρια!',
    cost: 15,
    category: 'avatars',
  },
  {
    id: 'avatar_king',
    type: 'avatar',
    avatar: '👑',
    name: 'Χρυσός Βασιλιάς',
    desc: 'Φοράει το στέμμα των νικητών!',
    cost: 20,
    category: 'avatars',
  },
  {
    id: 'avatar_ninja',
    type: 'avatar',
    avatar: '🥷',
    name: 'Μικρός Νίντζα',
    desc: 'Γρήγορος σαν αστραπή στα παιχνίδια!',
    cost: 25,
    category: 'avatars',
  },
  {
    id: 'avatar_dragon',
    type: 'avatar',
    avatar: '🐲',
    name: 'Χρυσός Δράκος',
    desc: 'Ο πιο σπάνιος και δυνατός φίλος!',
    cost: 30,
    category: 'avatars',
  },
  {
    id: 'avatar_unicorn',
    type: 'avatar',
    avatar: '🦄',
    name: 'Ουράνιος Μονόκερος',
    desc: 'Αστράφτει με τα χρώματα του ουράνιου τόξου!',
    cost: 40,
    category: 'avatars',
  },

  // BRUSHES & THEMES
  {
    id: 'brush_rainbow',
    type: 'brush',
    avatar: '🌈',
    name: 'Μαρκαδόρος Ουράνιο Τόξο',
    desc: 'Ζωγραφίζει αλλάζοντας μαγικά χρώματα!',
    cost: 15,
    category: 'brushes',
  },
  {
    id: 'brush_glitter',
    type: 'brush',
    avatar: '✨',
    name: 'Μαρκαδόρος Χρυσόσκονη',
    desc: 'Αφήνει λαμπερά αστεράκια όπου περνάει!',
    cost: 25,
    category: 'brushes',
  },

  // STICKER PACKS
  {
    id: 'pack_dinos',
    type: 'stickers',
    avatar: '🦖',
    name: 'Πακέτο Δεινόσαυροι',
    desc: 'Τυραννόσαυροι, Τρικεράτωπες και αυγά!',
    cost: 15,
    category: 'stickers',
  },
  {
    id: 'pack_sweets',
    type: 'stickers',
    avatar: '🍦',
    name: 'Πακέτο Γλυκά & Παγωτά',
    desc: 'Ντόνατς, γλειφιτζούρια, τούρτες και παγωτά!',
    cost: 15,
    category: 'stickers',
  },
];

export default function StarShopModal({ isOpen, onClose }) {
  const { activeChild, buyItem, equipAvatar } = useAuth();
  const [activeCategory, setActiveCategory] = useState('avatars');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const childStars = activeChild?.stars || 0;
  const inventory = activeChild?.inventory || [];

  const handleBuy = (item) => {
    setErrorMsg('');
    try {
      buyItem(item);
      playFanfare();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setErrorMsg(err.message);
      playPop();
    }
  };

  const handleEquip = (item) => {
    playPop();
    equipAvatar(item.avatar);
  };

  const filteredItems = SHOP_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 border-4 border-pink-400 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={() => {
            playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-100 border-2 border-pink-400 text-3xl mb-1.5 animate-bounce">
            🛍️
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
            Μαγικό Κατάστημα Αστεριών!
          </h3>
          <p className="text-xs text-slate-500 font-bold mt-0.5">
            Αγόρασε σούπερ avatars και μαγικά δώρα με τα αστέρια σου!
          </p>

          {/* Wallet pill */}
          <div className="inline-flex items-center gap-1.5 bg-yellow-100 border-2 border-yellow-400 px-4 py-1.5 rounded-full mt-2.5 shadow-sm">
            <span className="text-xs font-black text-amber-900">Το πορτοφόλι σου:</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-lg font-black text-amber-950">{childStars}</span>
            <span className="text-xs font-bold text-amber-800">αστέρια</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => {
              playPop();
              setActiveCategory('avatars');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-black rounded-xl transition-all ${
              activeCategory === 'avatars'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🦸 Σούπερ Avatars
          </button>
          <button
            type="button"
            onClick={() => {
              playPop();
              setActiveCategory('brushes');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-black rounded-xl transition-all ${
              activeCategory === 'brushes'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            ✨ Μαγικά Πινέλα
          </button>
          <button
            type="button"
            onClick={() => {
              playPop();
              setActiveCategory('stickers');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-black rounded-xl transition-all ${
              activeCategory === 'stickers'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🦖 Αυτοκόλλητα
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold p-2.5 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {filteredItems.map((item) => {
            const isOwned = inventory.includes(item.id);
            const isEquipped = activeChild?.avatar === item.avatar;
            const canAfford = childStars >= item.cost;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                  isEquipped
                    ? 'bg-amber-50 border-amber-400 shadow-sm ring-2 ring-amber-300'
                    : isOwned
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-4xl p-1 bg-white rounded-xl shadow-sm border border-slate-100">
                    {item.avatar}
                  </span>
                  <div>
                    <span className="text-sm font-black text-slate-800 block leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold block leading-snug mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-1">
                  <div className="flex items-center gap-1 font-black text-amber-900 text-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>{item.cost}</span>
                  </div>

                  {isEquipped ? (
                    <span className="text-[11px] font-black bg-amber-400 text-amber-950 px-2.5 py-1 rounded-xl">
                      Φοριέται ✓
                    </span>
                  ) : isOwned ? (
                    item.type === 'avatar' ? (
                      <button
                        onClick={() => handleEquip(item)}
                        className="text-[11px] font-black bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-xl shadow-sm"
                      >
                        Φόρεσέ το!
                      </button>
                    ) : (
                      <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-1 rounded-xl">
                        Αποκτήθηκε ✓
                      </span>
                    )
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`text-[11px] font-black px-3 py-1.5 rounded-xl transition-all ${
                        canAfford
                          ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-sm active:scale-95 cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Αγορά ✨' : 'Λείπουν ⭐'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <button
            onClick={() => {
              playPop();
              onClose();
            }}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl text-sm kid-shadow-sm transition-all"
          >
            Επιστροφή στο Παιχνίδι! 🎮
          </button>
        </div>
      </div>
    </div>
  );
}
