import React, { useState } from 'react';
import { playPop, playFanfare, playChime } from '../utils/sound';
import { X, Lightbulb, AlertTriangle, Send, CheckCircle, Copy, ExternalLink, Heart, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FeedbackModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('idea'); // 'idea' or 'bug'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('new_game');
  const [device, setDevice] = useState('ipad');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    playPop();
    setSubmitted(false);
    setCopied(false);
    setTitle('');
    setDescription('');
    onClose();
  };

  const getEmailBody = () => {
    if (tab === 'idea') {
      return `💡 ΠΡΟΤΑΣΗ ΙΔΕΑΣ - ΜΙΚΡΟΙ ΜΑΘΗΤΕΣ
--------------------------------------------------
Τίτλος: ${title}
Κατηγορία: ${category}

Περιγραφή:
${description}

(Στάλθηκε από την εφαρμογή Μικροί Μαθητές)`;
    } else {
      return `🛠️ ΑΝΑΦΟΡΑ ΠΡΟΒΛΗΜΑΤΟΣ - ΜΙΚΡΟΙ ΜΑΘΗΤΕΣ
--------------------------------------------------
Πρόβλημα: ${title}
Συσκευή: ${device}

Περιγραφή:
${description}

(Στάλθηκε από την εφαρμογή Μικροί Μαθητές)`;
    }
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const subject = encodeURIComponent(
      tab === 'idea' ? `[Ιδέα] ${title}` : `[Σφάλμα] ${title}`
    );
    const body = encodeURIComponent(getEmailBody());

    // Save to local feedback history
    try {
      const history = JSON.parse(localStorage.getItem('mikroi_mathites_feedback_history') || '[]');
      history.unshift({
        id: Date.now(),
        type: tab,
        title,
        description,
        date: new Date().toLocaleDateString('el-GR'),
      });
      localStorage.setItem('mikroi_mathites_feedback_history', JSON.stringify(history.slice(0, 20)));
    } catch (err) {}

    setSubmitted(true);

    // Open mailto link
    window.location.href = `mailto:kotinasspiros@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleCopyText = () => {
    playPop();
    const text = getEmailBody();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const githubIssueUrl = `https://github.com/teachkid/mikroimathites/issues/new?title=${encodeURIComponent(
    tab === 'idea' ? `[Ιδέα]: ${title || 'Πρόταση'}` : `[Σφάλμα]: ${title || 'Αναφορά προβλήματος'}`
  )}&body=${encodeURIComponent(getEmailBody())}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {submitted ? (
          /* Thank You Screen */
          <div className="text-center py-6 animate-pop">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-2 border-emerald-300">
              💌
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
              Ευχαριστούμε Θερμά!
            </h3>
            <p className="text-slate-600 font-bold text-sm sm:text-base mb-6 max-w-sm mx-auto">
              Η συμβολή σας βοηθάει να κάνουμε τους <strong>Μικρούς Μαθητές</strong> ακόμα καλύτερους, ασφαλέστερους και πιο διασκεδαστικούς! ❤️
            </p>
            <button
              onClick={handleClose}
              className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-8 py-3 rounded-2xl kid-shadow-sm active:scale-95 text-base"
            >
              Επιστροφή στην Εφαρμογή
            </button>
          </div>
        ) : (
          /* Form Content */
          <div>
            <div className="text-center mb-6">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center justify-center gap-2">
                <span>{tab === 'idea' ? '💡 Πρότεινε μια Ιδέα' : '🛠️ Αναφορά Προβλήματος'}</span>
              </h3>
              <p className="text-slate-500 font-bold text-xs sm:text-sm mt-1">
                Βοήθησέ μας να κάνουμε την εφαρμογή ακόμα καλύτερη για τα παιδιά!
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setTab('idea');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-sm transition-all ${
                  tab === 'idea'
                    ? 'bg-amber-400 text-amber-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>Νέα Ιδέα</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPop();
                  setTab('bug');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-sm transition-all ${
                  tab === 'bug'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Πρόβλημα / Bug</span>
              </button>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  {tab === 'idea' ? 'Τίτλος Ιδέας' : 'Τι πρόβλημα αντιμετώπισες;'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    tab === 'idea'
                      ? 'π.χ. Νέο παιχνίδι με δεινόσαυρους ή παζλ'
                      : 'π.χ. Δεν ακούγεται ο ήχος στο Safari'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-slate-800 text-sm"
                />
              </div>

              {tab === 'idea' ? (
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Κατηγορία Ιδέας
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-slate-800 text-sm bg-white"
                  >
                    <option value="Νέο Εκπαιδευτικό Παιχνίδι">🎮 Νέο Εκπαιδευτικό Παιχνίδι</option>
                    <option value="Αλφαβήτα & Γλώσσα">🔤 Αλφαβήτα & Γλώσσα</option>
                    <option value="Μαθηματικά & Αριθμοί">➕ Μαθηματικά & Αριθμοί</option>
                    <option value="Μουσική & Ήχοι">🎹 Μουσική & Ήχοι</option>
                    <option value="Ζωγραφική & Αυτοκόλλητα">🎨 Ζωγραφική & Αυτοκόλλητα</option>
                    <option value="Άλλη Πρόταση">✨ Άλλη Πρόταση</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Συσκευή που χρησιμοποιείς
                  </label>
                  <select
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none font-bold text-slate-800 text-sm bg-white"
                  >
                    <option value="iPad / Tablet (iOS)">📱 iPad (Apple Tablet)</option>
                    <option value="iPhone (iOS)">📱 iPhone</option>
                    <option value="Android Tablet / Smartphone">🤖 Android Tablet / Κινητό</option>
                    <option value="Mac / Apple Υπολογιστής">💻 Mac (Safari / Chrome)</option>
                    <option value="Windows PC">🖥️ Windows PC</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Περιγραφή & Λεπτομέρειες
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    tab === 'idea'
                      ? 'Περιέγραψε πώς φαντάζεσαι την ιδέα σου για να την υλοποιήσουμε!'
                      : 'Πότε και πού εμφανίστηκε το πρόβλημα; Οποιαδήποτε λεπτομέρεια μας βοηθάει να το διορθώσουμε!'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-slate-800 text-sm resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-white text-base shadow-md active:scale-95 transition-all ${
                    tab === 'idea'
                      ? 'bg-amber-500 hover:bg-amber-600'
                      : 'bg-rose-500 hover:bg-rose-600'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span>Αποστολή μέσω Email</span>
                </button>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Αντιγράφηκε!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>Αντιγραφή Κειμένου</span>
                      </>
                    )}
                  </button>

                  <a
                    href={githubIssueUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
                    title="Άνοιγμα στο GitHub Issues"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <span>GitHub Issues</span>
                  </a>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
