// Sound and Speech Engine for Kids App (PC, Mac, iOS, Android, Tablets)

let audioCtx = null;
let isAudioUnlocked = false;
let isGloballyMuted = false;

export function setSoundMuted(muted) {
  isGloballyMuted = muted;
  if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSoundMuted() {
  return isGloballyMuted;
}

// Audio context initializer
export function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Mobile/iOS Audio Unlocker on first user touch/click
function unlockAudio() {
  if (isAudioUnlocked) return;
  const ctx = getAudioContext();
  if (ctx) {
    // Play a tiny silent buffer to warm up audio subsystem on iOS/iPadOS
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);

    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  // Warm up SpeechSynthesis
  if ('speechSynthesis' in window) {
    const dummyUtterance = new SpeechSynthesisUtterance('');
    dummyUtterance.volume = 0;
    window.speechSynthesis.speak(dummyUtterance);
  }

  isAudioUnlocked = true;
  window.removeEventListener('touchstart', unlockAudio, true);
  window.removeEventListener('pointerdown', unlockAudio, true);
  window.removeEventListener('click', unlockAudio, true);
}

if (typeof window !== 'undefined') {
  window.addEventListener('touchstart', unlockAudio, true);
  window.addEventListener('pointerdown', unlockAudio, true);
  window.addEventListener('click', unlockAudio, true);
}

// Speak Greek text cross-platform
export function speakText(text, onEnd) {
  if (isGloballyMuted) return;
  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'el-GR';
    utterance.rate = 0.88; // Toddler friendly tempo
    utterance.pitch = 1.15; // Friendly warm pitch

    const voices = window.speechSynthesis.getVoices();
    // Match Greek voices across iOS/iPad (Melina, Nikos), Android (Google el-gr), Windows, etc.
    const greekVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('el') ||
        v.lang.toLowerCase().includes('greek') ||
        v.name.toLowerCase().includes('greek') ||
        v.name.toLowerCase().includes('melina') ||
        v.name.toLowerCase().includes('nikos')
    );

    if (greekVoice) {
      utterance.voice = greekVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
  }
}

// Ensure voices are loaded (needed on Chrome/Android which load async)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Voices cached
  };
}

// Bubble pop sound (Web Audio)
export function playPop() {
  if (isGloballyMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Ignore audio errors gracefully
  }
}

// Pleasant chime for matching cards / progress
export function playChime() {
  if (isGloballyMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.07);
      osc.stop(ctx.currentTime + i * 0.07 + 0.3);
    });
  } catch (e) {
    // Ignore
  }
}

// Warm musical tone for toy piano/xylophone
export function playPianoNote(freq) {
  if (isGloballyMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm overtone
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc2.start();
    osc.stop(ctx.currentTime + 0.8);
    osc2.stop(ctx.currentTime + 0.8);
  } catch (e) {
    // Ignore
  }
}

// Celebratory fanfare for level completions
export function playFanfare() {
  if (isGloballyMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);

      gain.gain.setValueAtTime(0.28, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.45);
    });
  } catch (e) {
    // Ignore
  }
}

// Greek audio cheers to warmly encourage children on achievements
const GREEK_CHEERS = [
  'Μπράβο! Τα κατάφερες!',
  'Είσαι αστέρι!',
  'Καταπληκτική δουλειά!',
  'Τέλεια! Συνέχισε έτσι!',
  'Πολύ καλά! Είσαι πανέξυπνος!',
  'Φανταστικά!',
];

export function speakCheer() {
  if (isGloballyMuted) return;
  const cheer = GREEK_CHEERS[Math.floor(Math.random() * GREEK_CHEERS.length)];
  setTimeout(() => {
    speakText(cheer);
  }, 450);
}

