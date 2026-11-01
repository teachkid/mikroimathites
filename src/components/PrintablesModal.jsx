import React, { useState } from 'react';
import { X, Printer, Download, Sparkles, Check, FileText } from 'lucide-react';
import { playPop } from '../utils/sound';

const WORKSHEETS = [
  {
    id: 'alphabet_letters',
    title: 'Αλφαβήτα: Προγραφή Α-Ω',
    category: 'alphabet',
    badge: 'Γράμματα',
    description: 'Εξάσκηση γραφής των γραμμάτων με διακεκομμένες γραμμές για ένωση με μολύβι.',
    emoji: '🔤',
    generateHTML: () => `
      <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h1 style="margin: 0; font-size: 24px; color: #333;">🎈 Μικροί Μαθητές • Προγραφή Αλφαβήτας</h1>
        <p style="font-size: 14px; color: #666; margin-bottom: 25px;">Όνομα: _____________________ Ημερομηνία: ___________</p>
        <p style="font-size: 13px; font-weight: bold; margin-bottom: 20px;">Ενώστε τις τελείες για να σχηματίσετε τα κεφαλαία και μικρά γράμματα:</p>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; max-width: 650px; margin: 0 auto;">
          ${['Α α', 'Β β', 'Γ γ', 'Δ δ', 'Ε ε', 'Ζ ζ', 'Η η', 'Θ θ', 'Ι ι', 'Κ κ', 'Λ λ', 'Μ μ', 'Ν ν', 'Ξ ξ', 'Ο ο', 'Π π', 'Ρ ρ', 'Σ σ', 'Τ τ', 'Υ υ', 'Φ φ', 'Χ χ', 'Ψ ψ', 'Ω ω'].map(pair => `
            <div style="border: 2px dashed #999; padding: 12px; border-radius: 8px; font-size: 28px; letter-spacing: 4px; font-family: monospace;">
              ${pair}
            </div>
          `).join('')}
        </div>
      </div>
    `
  },
  {
    id: 'numbers_counting',
    title: 'Αριθμοί 1 έως 10 & Μέτρηση',
    category: 'numbers',
    badge: 'Μαθηματικά',
    description: 'Μέτρησε τα αντικείμενα και γράψε τον σωστό αριθμό στο κουτάκι.',
    emoji: '🔢',
    generateHTML: () => `
      <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h1 style="margin: 0; font-size: 24px; color: #333;">🎈 Μικροί Μαθητές • Μέτρηση & Αριθμοί 1-10</h1>
        <p style="font-size: 14px; color: #666; margin-bottom: 25px;">Όνομα: _____________________ Ημερομηνία: ___________</p>
        <p style="font-size: 13px; font-weight: bold; margin-bottom: 20px;">Μέτρησε πόσα αντικείμενα βλέπεις και γράψε τον αριθμό στο κουτί:</p>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 650px; margin: 0 auto; text-align: left;">
          ${[
            { items: '🍎 🍎 🍎', count: '3' },
            { items: '⭐ ⭐ ⭐ ⭐ ⭐', count: '5' },
            { items: '🎈 🎈', count: '2' },
            { items: '🚗 🚗 🚗 🚗', count: '4' },
            { items: '🐱', count: '1' },
            { items: '🐟 🐟 🐟 🐟 🐟 🐟', count: '6' },
          ].map(row => `
            <div style="border: 1px solid #ccc; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 24px;">${row.items}</span>
              <div style="width: 45px; height: 45px; border: 2px solid #333; border-radius: 6px;"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  },
  {
    id: 'coloring_animals',
    title: 'Χρωμοσελίδα: Τα Αγαπημένα Ζωάκια',
    category: 'coloring',
    badge: 'Ζωγραφική',
    description: 'Εκτυπώσιμο σχέδιο για χρωμάτισμα με μαρκαδόρους ή ξυλομπογιές στο σπίτι.',
    emoji: '🎨',
    generateHTML: () => `
      <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h1 style="margin: 0; font-size: 24px; color: #333;">🎈 Μικροί Μαθητές • Ώρα για Ζωγραφική!</h1>
        <p style="font-size: 14px; color: #666; margin-bottom: 30px;">Όνομα: _____________________ Ημερομηνία: ___________</p>
        <div style="font-size: 110px; margin: 30px 0; border: 4px dashed #999; border-radius: 20px; padding: 30px; display: inline-block;">
          🦁 🐱 🐶 🐼 🐸
        </div>
        <p style="font-size: 16px; font-weight: bold; color: #444;">Χρωμάτισε τα ζωάκια με τα πιο όμορφα χρώματα!</p>
      </div>
    `
  }
];

export default function PrintablesModal({ isOpen, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!isOpen) return null;

  const handlePrint = (worksheet) => {
    playPop();
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Επιτρέψτε τα αναδυόμενα παράθυρα (popups) για εκτύπωση!');
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${worksheet.title} - Μικροί Μαθητές</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              @page { size: A4 portrait; margin: 15mm; }
            }
          </style>
        </head>
        <body>
          ${worksheet.generateHTML()}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-pop">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-8 border-4 border-amber-300 shadow-2xl overflow-y-auto max-h-[90vh]">
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

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-2xl">
            🖨️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950">
              Εκτυπώσιμα Φύλλα Εργασίας
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 font-bold">
              Εκτυπώστε δωρεάν ασκήσεις & χρωμοσελίδες για το σπίτι!
            </p>
          </div>
        </div>

        {/* Worksheets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {WORKSHEETS.map((ws) => (
            <div
              key={ws.id}
              className="p-5 rounded-3xl bg-amber-50/60 border-2 border-amber-200 hover:border-amber-400 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">{ws.emoji}</span>
                  <span className="bg-amber-200 text-amber-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    {ws.badge}
                  </span>
                </div>

                <h3 className="font-black text-slate-900 text-base mb-1">
                  {ws.title}
                </h3>

                <p className="text-xs text-slate-600 font-bold leading-relaxed mb-4">
                  {ws.description}
                </p>
              </div>

              <button
                onClick={() => handlePrint(ws)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs sm:text-sm kid-shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" />
                <span>Εκτύπωση σε Χαρτί / PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
