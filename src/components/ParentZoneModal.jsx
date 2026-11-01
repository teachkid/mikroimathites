import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { playPop, playFanfare } from '../utils/sound';
import { X, ShieldCheck, UserPlus, LogOut, Star, CheckCircle, Baby } from 'lucide-react';
import ViewModeSwitcher from './ViewModeSwitcher';

const AVATARS = ['🦁', '🐼', '🦄', '🚀', '🐱', '🐶', '🐻', '🐸', '🦋', '🦖'];

export default function ParentZoneModal({ isOpen, onClose, onOpenFeedback }) {
  const { currentUser, activeChild, switchChild, addChild, logout } = useAuth();

  // Parent Gate Math Challenge state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [num1] = useState(() => Math.floor(Math.random() * 6) + 3);
  const [num2] = useState(() => Math.floor(Math.random() * 5) + 2);
  const [gateAnswer, setGateAnswer] = useState('');
  const [gateError, setGateError] = useState(false);

  // Add Child mini form
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(4);
  const [newChildAvatar, setNewChildAvatar] = useState('🐼');

  useEffect(() => {
    if (!isOpen) {
      setIsUnlocked(false);
      setGateError(false);
      setGateAnswer('');
      setIsAddingChild(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGateSubmit = (e) => {
    e.preventDefault();
    if (parseInt(gateAnswer, 10) === num1 * num2) {
      playPop();
      setIsUnlocked(true);
      setGateError(false);
    } else {
      setGateError(true);
      setGateAnswer('');
    }
  };

  const handleAddChildSubmit = (e) => {
    e.preventDefault();
    if (!newChildName) return;
    playFanfare();
    addChild(newChildName, newChildAge, newChildAvatar);
    setIsAddingChild(false);
    setNewChildName('');
  };

  const handleLogout = () => {
    playPop();
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => {
            playPop();
            onClose();
            setIsUnlocked(false);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* STEP 1: PARENT GATE (Child Lock) */}
        {!isUnlocked ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 text-3xl mb-3">
              🔒
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-1">
              Ζώνη Γονέων
            </h3>
            <p className="text-xs text-slate-500 font-bold mb-6">
              Για την ασφάλεια των παιδιών, λύστε την πράξη:
            </p>

            <form onSubmit={handleGateSubmit} className="max-w-xs mx-auto space-y-4">
              <div className="text-2xl font-black text-amber-900 bg-amber-50 py-3 rounded-2xl border-2 border-amber-200">
                {num1} × {num2} = ?
              </div>

              <input
                type="number"
                required
                autoFocus
                placeholder="Αποτέλεσμα"
                value={gateAnswer}
                onChange={(e) => setGateAnswer(e.target.value)}
                className="w-full text-center text-xl font-black py-2.5 rounded-2xl border-2 border-slate-300 focus:border-amber-400 focus:outline-none"
              />

              {gateError && (
                <p className="text-xs font-bold text-rose-500">
                  Λάθος αποτέλεσμα! Δοκιμάστε ξανά.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 font-black text-amber-950 rounded-2xl kid-shadow-sm text-base transition-all"
              >
                Είσοδος στη Ζώνη Γονέα 🔓
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: PARENT DASHBOARD */
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-2xl flex items-center justify-center">
                👨‍👩‍👧
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">
                  {currentUser?.parentName || 'Γονέας'}
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  {currentUser?.email || 'Επισκέπτης'}
                </p>
              </div>
            </div>

            {/* Children List */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black text-slate-800">
                  👶 Παιδικά Προφίλ στην Οικογένεια:
                </span>
                {!isAddingChild && currentUser && (
                  <button
                    onClick={() => {
                      playPop();
                      setIsAddingChild(true);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Προσθήκη Παιδιού</span>
                  </button>
                )}
              </div>

              {/* Add Child Form */}
              {isAddingChild && (
                <form
                  onSubmit={handleAddChildSubmit}
                  className="bg-amber-50/80 p-4 rounded-2xl border-2 border-amber-200 mb-4 animate-pop space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-amber-950">
                      Νέο Παιδικό Προφίλ:
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingChild(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Όνομα παιδιού"
                      value={newChildName}
                      onChange={(e) => setNewChildName(e.target.value)}
                      className="col-span-2 px-3 py-1.5 rounded-xl border border-amber-300 font-bold text-xs"
                    />
                    <select
                      value={newChildAge}
                      onChange={(e) => setNewChildAge(Number(e.target.value))}
                      className="px-2 py-1.5 rounded-xl border border-amber-300 font-bold text-xs bg-white"
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9].map((a) => (
                        <option key={a} value={a}>
                          {a} ετών
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Avatar Picker */}
                  <div className="flex gap-1.5 overflow-x-auto py-1">
                    {AVATARS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setNewChildAvatar(av)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                          newChildAvatar === av
                            ? 'bg-amber-300 scale-110 border border-amber-600'
                            : 'bg-white'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs"
                  >
                    Αποθήκευση Προφίλ
                  </button>
                </form>
              )}

              {/* Profiles Cards */}
              <div className="space-y-2">
                {(currentUser?.children || [activeChild]).map((child) => {
                  const isActive = activeChild?.id === child.id;
                  return (
                    <div
                      key={child.id}
                      onClick={() => {
                        playPop();
                        switchChild(child.id);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-50 border-amber-400 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{child.avatar}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-800 text-sm">
                              {child.name}
                            </span>
                            {isActive && (
                              <span className="text-[10px] font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full">
                                Ενεργό
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-bold">
                            {child.age} ετών
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                        <span className="font-black text-amber-900 text-sm">
                          {child.stars || 0}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* View Mode Preferences */}
            <div className="mb-4 p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>🖥️ Επιλογή Έκδοσης Προβολής</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 font-bold mt-0.5">
                    Επιλέξτε προβολή για Υπολογιστή (PC) ή Κινητό (Mobile)
                  </p>
                </div>
                <ViewModeSwitcher />
              </div>
            </div>

            {/* Feedback / Ideas & Bug Reports */}
            <div className="mb-5 p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <span>💡 Πρόταση Ιδέας ή 🛠️ Αναφορά Προβλήματος</span>
                  </h4>
                  <p className="text-[11px] text-amber-800/80 font-bold mt-0.5">
                    Έχετε πρόταση για νέο παιχνίδι ή παρατηρήσατε κάποιο σφάλμα;
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    onClose();
                    onOpenFeedback?.();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs kid-shadow-sm active:scale-95 transition-all self-start sm:self-auto"
                >
                  Άνοιγμα Φόρμας
                </button>
              </div>
            </div>

            {/* Logout / Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-800"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Αποσύνδεση</span>
                </button>
              ) : (
                <span className="text-xs text-slate-400 font-bold">
                  Παίζετε ως Επισκέπτης
                </span>
              )}

              <button
                onClick={() => {
                  playPop();
                  onClose();
                  setIsUnlocked(false);
                }}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-xs"
              >
                Κλείσιμο
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
