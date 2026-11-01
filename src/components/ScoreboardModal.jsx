import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { playPop, playFanfare, speakText } from '../utils/sound';
import { getTimeUntilNextMonday, getCurrentWeekKey } from '../utils/time';
import { X, Trophy, Star, Award, ShieldCheck, Sparkles, Clock, UserCheck, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ScoreboardModal({ isOpen, onClose, onOpenAuth }) {
  const { currentUser, activeChild, isGuest, getWeeklyLeaderboard } = useAuth();
  const [tab, setTab] = useState('podium'); // 'podium' or 'badges'

  if (!isOpen) return null;

  // Retrieve ONLY registered children from verified accounts
  const registeredLeaderboard = getWeeklyLeaderboard();
  const timeLeft = getTimeUntilNextMonday();

  // Find if current child is in the leaderboard
  const myRankIndex = registeredLeaderboard.findIndex((item) => item.isCurrent);
  const myRank = myRankIndex !== -1 ? myRankIndex + 1 : null;

  // Badges calculations for active child
  const badges = [
    {
      id: 'first_star',
      name: 'Πρώτο Αστέρι!',
      icon: '⭐',
      desc: 'Κέρδισες το πρώτο σου αστέρι',
      unlocked: (activeChild?.stars || 0) >= 1,
    },
    {
      id: 'registered_badge',
      name: 'Επίσημος Μαθητής',
      icon: '🎓',
      desc: 'Έγινες μέλος με εγγεγραμμένο λογαριασμό',
      unlocked: !isGuest,
    },
    {
      id: 'balloon_hunter',
      name: 'Μπαλονο-Κυνηγός',
      icon: '🎈',
      desc: 'Έσκασες 10+ μπαλόνια',
      unlocked: (activeChild?.balloonHighScore || 0) >= 10,
    },
    {
      id: 'piano_maestro',
      name: 'Μικρός Μότσαρτ',
      icon: '🎹',
      desc: 'Έπαιξες τραγούδι στο πιάνο',
      unlocked: (activeChild?.songsCount || 0) >= 1,
    },
    {
      id: 'master_writer',
      name: 'Μικρός Συγγραφέας',
      icon: '✍️',
      desc: 'Σχεδίασες γράμματα της αλφαβήτας',
      unlocked: (activeChild?.tracedCount || 0) >= 1,
    },
    {
      id: 'memory_master',
      name: 'Δυνατή Μνήμη',
      icon: '🧠',
      desc: 'Νίκησες στο παιχνίδι μνήμης',
      unlocked: (activeChild?.memoryWins || 0) >= 1,
    },
    {
      id: 'star_collector',
      name: 'Αστερο-Συλλέκτης',
      icon: '👑',
      desc: 'Μάζεψες 20+ αστέρια',
      unlocked: (activeChild?.stars || 0) >= 20,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 border-4 border-yellow-400 shadow-2xl overflow-y-auto max-h-[92vh]">
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 border-2 border-yellow-400 text-3xl mb-1.5 animate-bounce">
            🏆
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
            Εβδομαδιαίο Βάθρο Νικητών
          </h3>
          <p className="text-xs text-slate-500 font-bold flex items-center justify-center gap-1 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Ανανέωση σε: <strong>{timeLeft}</strong> (Κάθε Δευτέρα πρωί)</span>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => {
              playPop();
              setTab('podium');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-black rounded-xl transition-all ${
              tab === 'podium'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🏆 Βάθρο Εβδομάδας
          </button>
          <button
            type="button"
            onClick={() => {
              playPop();
              setTab('badges');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-black rounded-xl transition-all ${
              tab === 'badges'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🎖️ Παράσημα ({badges.filter((b) => b.unlocked).length}/{badges.length})
          </button>
        </div>

        {/* Guest Warning / Register prompt if not logged in */}
        {isGuest && (
          <div className="bg-amber-50 border-2 border-amber-300 p-3.5 rounded-2xl mb-4 flex items-center justify-between gap-3 animate-pop">
            <div>
              <span className="text-xs font-black text-amber-950 block">
                🔒 Επίσημη Συμμετοχή στο Βάθρο:
              </span>
              <span className="text-[11px] text-amber-800 font-bold block leading-tight">
                Στο βάθρο διαγωνίζονται μόνο παιδιά με λογαριασμό γονέα!
              </span>
            </div>
            <button
              onClick={() => {
                playPop();
                onClose();
                onOpenAuth();
              }}
              className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-sm transition-all"
            >
              Εγγραφή ✨
            </button>
          </div>
        )}

        {/* TAB 1: WEEKLY PODIUM (REGISTERED ONLY) */}
        {tab === 'podium' && (
          <div>
            {/* Top 3 Weekly Podium */}
            <div className="flex items-end justify-center gap-2 sm:gap-3 mb-5 pt-3">
              {/* 2nd place */}
              {registeredLeaderboard[1] && (
                <div
                  className={`flex-1 rounded-2xl p-3 flex flex-col items-center text-center border-2 ${
                    registeredLeaderboard[1].isCurrent
                      ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300'
                      : 'bg-gradient-to-b from-slate-100 to-slate-200 border-slate-300'
                  }`}
                >
                  <span className="text-2xl mb-1">{registeredLeaderboard[1].avatar}</span>
                  <span className="text-xs font-black text-slate-800 truncate w-full">
                    {registeredLeaderboard[1].name}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 mt-0.5">
                    🥈 2η Θέση
                  </span>
                  <span className="text-xs font-black text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full mt-1">
                    {registeredLeaderboard[1].weeklyStars} ⭐
                  </span>
                </div>
              )}

              {/* 1st place */}
              {registeredLeaderboard[0] && (
                <div
                  className={`flex-1 rounded-3xl p-4 flex flex-col items-center text-center -translate-y-2.5 shadow-lg border-3 ${
                    registeredLeaderboard[0].isCurrent
                      ? 'bg-gradient-to-b from-yellow-200 to-amber-300 border-yellow-500 ring-2 ring-yellow-400'
                      : 'bg-gradient-to-b from-yellow-200 to-amber-300 border-yellow-500'
                  }`}
                >
                  <span className="text-4xl mb-1 animate-pulse">
                    {registeredLeaderboard[0].avatar}
                  </span>
                  <span className="text-sm font-black text-amber-950 truncate w-full">
                    {registeredLeaderboard[0].name}
                  </span>
                  <span className="text-xs font-black text-amber-900 mt-0.5">
                    🥇 1ος Νικητής!
                  </span>
                  <span className="text-xs sm:text-sm font-black text-amber-950 bg-white/80 px-2.5 py-0.5 rounded-full mt-1 shadow-sm">
                    {registeredLeaderboard[0].weeklyStars} ⭐
                  </span>
                </div>
              )}

              {/* 3rd place */}
              {registeredLeaderboard[2] && (
                <div
                  className={`flex-1 rounded-2xl p-3 flex flex-col items-center text-center border-2 ${
                    registeredLeaderboard[2].isCurrent
                      ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300'
                      : 'bg-gradient-to-b from-amber-50 to-orange-100 border-amber-300'
                  }`}
                >
                  <span className="text-2xl mb-1">{registeredLeaderboard[2].avatar}</span>
                  <span className="text-xs font-black text-amber-900 truncate w-full">
                    {registeredLeaderboard[2].name}
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 mt-0.5">
                    🥉 3η Θέση
                  </span>
                  <span className="text-xs font-black text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full mt-1">
                    {registeredLeaderboard[2].weeklyStars} ⭐
                  </span>
                </div>
              )}
            </div>

            {/* Rest of registered leaderboard */}
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block px-1">
                Υπόλοιπη Εβδομαδιαία Κατάταξη:
              </span>
              {registeredLeaderboard.slice(3).map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border-2 transition-all ${
                    item.isCurrent
                      ? 'bg-amber-100 border-amber-400 font-black shadow-sm ring-2 ring-amber-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black text-slate-400 w-5 text-center">
                      #{idx + 4}
                    </span>
                    <span className="text-2xl">{item.avatar}</span>
                    <div>
                      <span className="text-sm font-black text-slate-800">
                        {item.name} {item.isCurrent && '(Εσύ!)'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold block">
                        Σύνολο: {item.totalStars} αστέρια
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-yellow-100 px-2.5 py-1 rounded-full border border-yellow-300">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span className="text-xs font-black text-amber-900">
                      {item.weeklyStars} αυτή την εβδομάδα
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Registered Kid Status Banner */}
            {!isGuest && myRank && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-2.5 rounded-2xl text-center text-xs font-black">
                🎉 Συγχαρητήρια {activeChild?.name}! Βρίσκεσαι στην #{myRank} θέση του εβδομαδιαίου πρωταθλήματος!
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BADGES & ACHIEVEMENTS */}
        {tab === 'badges' && (
          <div className="grid grid-cols-2 gap-2.5">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                  badge.unlocked
                    ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <span className="text-xs font-black text-slate-800 leading-tight mb-0.5">
                  {badge.name}
                </span>
                <span className="text-[10px] text-slate-500 font-bold leading-tight">
                  {badge.desc}
                </span>
                {badge.unlocked ? (
                  <span className="mt-2 text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Ξεκλειδώθηκε! ✓
                  </span>
                ) : (
                  <span className="mt-2 text-[9px] font-bold text-slate-400">
                    🔒 Κλειδωμένο
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <button
            onClick={() => {
              playPop();
              onClose();
            }}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl text-sm kid-shadow-sm transition-all"
          >
            Συνέχισε το Παιχνίδι! 🎮
          </button>
        </div>
      </div>
    </div>
  );
}
