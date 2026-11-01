import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { playPop, playFanfare, speakText } from '../utils/sound';
import { X, Lock, Mail, User, Sparkles, Heart, ShieldCheck, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const AVATARS = ['🦁', '🐼', '🦄', '🚀', '🐱', '🐶', '🐻', '🐸', '🦋', '🦖'];

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [error, setError] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [parentName, setParentName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(4);
  const [childAvatar, setChildAvatar] = useState('🦁');

  useEffect(() => {
    if (!isOpen) {
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      playPop();
      login(loginEmail, loginPassword);
      playFanfare();
      confetti({ particleCount: 70, spread: 60 });
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!parentName || !registerEmail || !registerPassword || !childName) {
      setError('Παρακαλώ συμπληρώστε όλα τα πεδία!');
      return;
    }
    if (registerPassword.length < 4) {
      setError('Ο κωδικός πρέπει να έχει τουλάχιστον 4 χαρακτήρες!');
      return;
    }

    try {
      playPop();
      register(parentName, registerEmail, registerPassword, childName, childAge, childAvatar);
      playFanfare();
      confetti({ particleCount: 100, spread: 80 });
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  // Demo auto-fill helper for instant testing
  const handleDemoFill = () => {
    playPop();
    setTab('register');
    setParentName('Γιώργος Παπαδόπουλος');
    setRegisterEmail('demo@mathites.gr');
    setRegisterPassword('123456');
    setChildName('Νικόλας');
    setChildAge(4);
    setChildAvatar('🦁');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => {
            playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Header Icon */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 text-3xl mb-2">
            👨‍👩‍👧
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            {tab === 'login' ? 'Σύνδεση Γονέα' : 'Δημιουργία Λογαριασμού'}
          </h3>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Αποθήκευση αστεριών, προόδου και παιδικών προφίλ!
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => {
              playPop();
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-2 text-sm font-black rounded-xl transition-all ${
              tab === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Σύνδεση
          </button>
          <button
            type="button"
            onClick={() => {
              playPop();
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-2 text-sm font-black rounded-xl transition-all ${
              tab === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Εγγραφή (Δωρεάν)
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Email Γονέα:
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Κωδικός Πρόσβασης:
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-amber-950 font-black rounded-2xl kid-shadow-sm text-base transition-all mt-2"
            >
              Σύνδεση 🚀
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Ονοματεπώνυμο Γονέα:
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="π.χ. Μαρία Παπαδοπούλου"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Email:</label>
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Κωδικός:</label>
                <input
                  type="password"
                  required
                  placeholder="τουλάχιστον 4 χαρ."
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-xs"
                />
              </div>
            </div>

            {/* Child Profile Section */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-xs font-black text-amber-950 block mb-2">
                👶 Προφίλ Παιδιού:
              </span>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    Όνομα Παιδιού:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="π.χ. Νικόλας"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-amber-300 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    Ηλικία:
                  </label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xl border border-amber-300 font-bold text-xs bg-white"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9].map((age) => (
                      <option key={age} value={age}>
                        {age} ετών
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Avatar selection */}
              <div>
                <label className="block text-[11px] font-bold text-amber-900 mb-1">
                  Διάλεξε Avatar για το παιδί:
                </label>
                <div className="flex gap-1.5 overflow-x-auto py-1">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setChildAvatar(av)}
                      className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-xl transition-transform ${
                        childAvatar === av
                          ? 'bg-amber-300 scale-110 border-2 border-amber-600 shadow'
                          : 'bg-white border border-amber-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black rounded-2xl kid-shadow-sm text-base transition-all"
            >
              Δημιουργία & Έναρξη! ✨
            </button>
          </form>
        )}

        {/* Quick Demo Helper & Guest mode */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
          >
            <span>💡 Αυτόματη συμπλήρωση δοκιμαστικού λογαριασμού</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playPop();
              onClose();
            }}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Ή συνέχισε ως Επισκέπτης (χωρίς λογαριασμό) →
          </button>
        </div>
      </div>
    </div>
  );
}
